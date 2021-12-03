// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodItemSelector from './../tools/food_item_selector'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/user_input.css'
import './../../styles/message.css'

/* The AddItemOrMeal component provides an interface for a user to add a food
	object or a meal to a food record on their account. User's can also create
	new food records by adding a food object or meal to a date that is not
	currently associated with a food record on the user's account. */
class AddItemOrMeal extends Component {
	static contextType = AccountRecordsContext

	constructor(props){
		super(props)
		
		this.addItem = this.addItem.bind(this)
		this.addMeal = this.addMeal.bind(this)
		this.updateFoodRecord = this.updateFoodRecord.bind(this)
		this.setMealOptions = this.setMealOptions.bind(this)
		this.handleMealChange = this.handleMealChange.bind(this)
		this.toggleMenuState = this.toggleMenuState.bind(this)
		this.updateDate = this.updateDate.bind(this)
		this.setDate = this.setDate.bind(this)
		
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			date: '',
			meal: '',
			mealIndex: 0,
			mealOptions: [],
			mealMenu: false,
			locked: false,
			numFoodObjects: 0,
			numFoodRecords: 0,
			foodRecordIndex: 0
		}
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('addItem')
		})
	}
	
	handleMealChange(e){
		e.preventDefault()

		this.setState({
			mealIndex: e.target.value
		})
	}
	
	updateDate(e){
		e.preventDefault()
		this.setState({
			date: e.target.value
		})
	}
	
	toggleMenuState(){
		this.setState({
			mealMenu: !this.state.mealMenu
		})
	}
	
	addItem(newFoodItem, newQuantity){
		let foodObject = {
			foodItem: newFoodItem,
			quantity: newQuantity
		}
		
		this.updateFoodRecord(foodObject)
	}
	
	addMeal(e){
		e.preventDefault()
		let mealObject = {
			mealName: this.context.meals[this.state.mealIndex].mealName,
			foodObjects: this.context.meals[this.state.mealIndex].foodObjects
		}
		
		this.updateFoodRecord(mealObject)
	}
	
	/* The updateFoodRecord method adds the food object passed in as an
		argument to a food record on the user account that the client is
		logged into. */
	updateFoodRecord(foodObject){
		let foodRecordIndex = -1
		let numFoodRecords = this.context.foodRecords.length
		let numFoodObjects = 0
		
		/* Checks if a food record already exists for the date that the 
			food object is being added to. */
		for (let i=0; i<numFoodRecords;i++){
			if (this.state.date === this.context.foodRecords[i].date){
				numFoodObjects = this.context.foodRecords[i].record.length
				foodRecordIndex = i
				break
			}
		}
		
		this.setState({
			locked: true,
			numFoodRecords,
			numFoodObjects,
			foodRecordIndex
		}, () => {
			if (foodRecordIndex === -1){
				this.context.addFoodRecord(foodObject, this.state.date,
					'addItem')
			} else {
				this.context.addObjectToRecord(foodObject, foodRecordIndex,
					'addItem')
			}
		})
	}
	
	/* The setMealOptions method creates a list of meal options; one for each
		of the current user's meals. */
	setMealOptions() {
		let numItems = this.context.meals.length
		let currentMealOptions = []
		let currentMeal = ''
		
		for (let i=0; i<numItems; i++){
			currentMealOptions.push(
				<option
					key={i}
					value={i}
					>{this.context.meals[i].mealName}
				</option>
			)
		}
		
		// Sets default meal option.
		if (numItems !== 0){
			currentMeal = this.context.meals[0].mealName
		}
		
		this.setState({
			meal: currentMeal,
			mealOptions: currentMealOptions
		})
	}
	
	/* The setDate method formats the current date into a string that can be
		used as the default date for the date input box. */
	setDate(){
		let today = new Date()
		let month = (parseInt(today.getMonth()) + 1)
		let day = parseInt(today.getDate())
		let currentDate = ''
		
		if (month < 10){
			month = '0' + month.toString()
		} else {
			month = month.toString()
		}
		
		if (day < 10){
			day = '0' + day.toString()
		} else {
			day = day.toString()
		}
		
		currentDate = today.getFullYear() + '-' + month + '-' + day
		
		this.setState({
			date: currentDate
		})
	}
	
	componentDidMount() {
		this.setMealOptions()
		this.setDate()
	}
	
	componentDidUpdate(){
		let foodRecord = this.context.foodRecords[this.state.foodRecordIndex]
		let updated = false
		
		if (this.state.locked){
			/* If the database was updated successfully then unlock the
				component. */
			if (this.context.foodRecords.length > this.state.numFoodRecords){
				updated = true
			} else if(foodRecord){
				if (foodRecord.record.length > this.state.numFoodObjects){
					updated = true
				}
			}
			
			if (updated){
				this.setState({
					locked: false,
					numFoodObjects: 0,
					numFoodRecords: 0,
					foodRecordIndex: 0
				})
			}
		}
	}
	
	render() {
		if (this.context.error.addItem){
			return (
				<>
					<button
						className='message__close-button'
						onClick={this.acknowledgeError}
						>x
					</button>
					<p className='message--error'>
						Error: Failed to add item to database.
					</p>
				</>
			)
		} else if (this.state.locked){
			return (
				<p className='message--loading'>
					Adding item to database...
				</p>
			)
		} else if (this.state.mealMenu){
			return (
				<div>
					<button
						className='menu__button' 
						onClick={this.toggleMenuState}
						>Food Items
					</button>
					<br />
					{ this.state.mealOptions.length !== 0 ?
						<table className='user-input__table--centered'>
							<tbody>
								<tr>
									<td>
										<label>Meal</label>
									</td>
									<td>
										<select
											className='user-input__input-box'
											value={this.state.mealIndex}
											onChange={this.handleMealChange}
											>{this.state.mealOptions}
										</select>
									</td>
								</tr>
								<tr>
									<td>
										<label>Date</label>
									</td>
									<td>
										<input
											className='user-input__input-box'
											type='date'
											value={this.state.date}
											onChange={this.updateDate}>
										</input>
									</td>
								</tr>
								<tr>
									<td colSpan='2'>
										<button onClick={this.addMeal}>
											Add Meal
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					:
						<p className='menu__section-text'>
							This account does not have any meals. Go to <i>
							My Meals</i> to create meals for your account.
						</p>
					}
				</div>
			)
		} else {
			return (
				<div>
					<button
						className='menu__button' 
						onClick={this.toggleMenuState}
						>Meal Options
					</button>
					<br />
					<FoodItemSelector 
						sendValue={this.addItem}
						date={this.state.date}
						updateDate={this.updateDate} 
					/>
				</div>
			)
		}
    }

}

export default AddItemOrMeal