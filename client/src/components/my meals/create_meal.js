// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodItemSelector from './../tools/food_item_selector'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/message.css'
import './../../styles/food_table.css'
import './../../styles/user_input.css'
import './../../styles/create_meal.css'

/* The CreateMeal component provides a staging area for a client logged into a
	user account to create and add new meals to the user's account. */
class CreateMeal extends Component {
	static contextType = AccountRecordsContext
	
	constructor(props) {
		super(props)
		
		this.saveMeal = this.saveMeal.bind(this)
		this.addFoodObject = this.addFoodObject.bind(this)
		this.removeFoodObject = this.removeFoodObject.bind(this)
		this.onChangeMealName = this.onChangeMealName.bind(this)
		this.validMeal = this.validMeal.bind(this)
		this.validMealName = this.validMealName.bind(this)
		this.setUserMealNames = this.setUserMealNames.bind(this)
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			mealName: '',
			userMealNames: [],
			foodObjects: [],
			currentMealRef: React.createRef(),
			currentMealRows: [],
			saveMessage: '',
			saveMessageStyle: 'message--confirmation',
			locked: false
		}
	}
	
	onChangeMealName(e){
		e.preventDefault()

		this.setState({
			mealName: e.target.value
		})
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('createMeal')
		})
	}
	
	/* The saveMeal method saves the current meal from the staging area to the
		user account that the client is logged into. */
	saveMeal(){
		let mealObject = {
			mealName: this.state.mealName,
			foodObjects: this.state.foodObjects
		}
		
		if (this.validMeal()){
			this.setState({
				locked: true
			}, () => {
				this.context.addMeal(mealObject, 'createMeal')
			})
		}
	}
	
	/* The validMeal method returns true if the current meal in the staging
		area is not empty and has a valid meal name, the method returns false
		otherwise. */
	validMeal(){
		let validMeal = true
		let currentMessage = ''
		let currentStyle = ''
		
		if (this.validMealName()){
			if (this.state.foodObjects.length === 0){
				currentMessage = 'Error: Meal is empty.'
				currentStyle = 'message--error'
				validMeal = false
			}
		} else {
			if (this.state.mealName === ''){
				currentMessage = 'Error: Please enter a meal name.'
				currentStyle = 'message--error'
				validMeal = false
			} else {
				currentMessage = 'Error: User already has a meal named ' +
					this.state.mealName + '.'
				currentStyle = 'message--error'
				validMeal = false
			}
		}
		
		if (!validMeal){
			this.setState({
				saveMessage: currentMessage,
				saveMessageStyle:  currentStyle
			})
		}
		
		return validMeal
	}
	
	/* The validMealName method returns false if the name of the meal in the
		stagging area is already being used by another meal on the user account
		that the client is logged into, the method returns true otherwise. (All
		of a user's meal names must be unique.) */
	validMealName(){
		let numItems = this.state.userMealNames.length
		
		if(this.state.mealName === ''){
			return false
		}
		
		for (var i=0; i<numItems; i++){
			if (this.state.userMealNames[i] === this.state.mealName){
				return false
			}
		}
		return true
	}
	
	/* The addFoodObject method adds a new food object to the meal in the
		staging area. */
	addFoodObject(newFoodItem, newQuantity){
		let foodObject = {
			foodItem: newFoodItem,
			quantity: newQuantity
		}
		let updatedFoodObjects = this.state.foodObjects
		let updatedMealRows = this.state.currentMealRows
		let numFoodItems = updatedMealRows.length
		
		// Add the new food object to the foodObjects list.
		updatedFoodObjects.push(foodObject)
		
		// Add the new food object to the new meal staging area table.
		updatedMealRows.push(
			<tr key={numFoodItems} className='food-table__tr'>
				<td className='food-table__td'>
					{foodObject.foodItem}
				</td>
				<td className='food-table__td'>
					{foodObject.quantity}g
				</td>
				<td className='food-table__td'>
					<button
						onClick={this.removeFoodObject}
						name={numFoodItems}
						title='remove item'
						className='food-table__remove-button'
						>x
					</button>
				</td>
			</tr>
		)
		
		this.setState({
			foodObjects: updatedFoodObjects,
			currentMealRows: updatedMealRows
		},() => {
			// Scrolls to the bottom of the new meal staging area table.
			window.requestAnimationFrame(()=>{
				let currentHeight =
					this.state.currentMealRef.current.scrollHeight
				this.state.currentMealRef.current.scrollTo(
					0, currentHeight
				)
			})
		})
	}
	
	/* The removeFoodObject method removes the food object associated with the
		button that called the method from the meal in the staging area. */
	removeFoodObject(e){
		let foodObjectIndex = e.target.name
		let updatedFoodObjects = []
		let updatedMealRows = []
		
		// Removes food object from list of current foodObjects.
		for (let i=0; i<this.state.foodObjects.length; i++){
			if (i !== parseInt(foodObjectIndex)){
				updatedFoodObjects.push(this.state.foodObjects[i])
			}
		}
		
		// Removes food object from new meal staging area table.
		for (let i=0; i<this.state.currentMealRows.length; i++){
			if (i < foodObjectIndex){
				updatedMealRows.push(this.state.currentMealRows[i])
			} else if (i > foodObjectIndex){
				updatedMealRows.push(
					<tr key={i-1} className='food-table__tr'>
						<td className='food-table__td'>
							{updatedFoodObjects[i-1].foodItem}
						</td>
						<td className='food-table__td'>
							{updatedFoodObjects[i-1].quantity}g
						</td>
						<td className='food-table__td'>
							<button 
								onClick={this.removeFoodObject} 
								name={i-1}
								title='remove item' 
								className='food-table__remove-button'
								>x
							</button>
						</td>
					</tr>
				)
			}
		}
		
		this.setState({
			foodObjects: updatedFoodObjects,
			currentMealRows: updatedMealRows
		})
	}
	
	/* The setUserMealNames method populates the userMealNames state variable
		with the names of all of the meals on the user account that the client
		is logged into. */
	setUserMealNames(){
		let currentMealNames = []
		let numItems = this.context.meals.length
		for (var i=0;i<numItems;i++) {
			currentMealNames.push(this.context.meals[i].mealName)
		}
		this.setState({
			userMealNames: currentMealNames
		})
	}
	
	componentDidMount() {
		this.setUserMealNames()
	}
	
	componentDidUpdate(){
		let currentMealNames = this.state.userMealNames
		
		if (this.state.userMealNames.length !== this.context.meals.length){
			if (this.state.locked){
				currentMealNames.push(this.state.mealName)
				
				this.setState({
					mealName: '',
					foodObjects: [],
					currentMealRows: [],
					saveMessage: 'Added \'' + this.state.mealName +
						'\' to the database.',
					saveMessageStyle: 'message--confirmation',
					userMealNames: currentMealNames,
					locked: false
				})
			} else {
				this.setUserMealNames()
			}
		}
	}


	render() {
		let messageRow =
			<tr>
				<td colSpan='2'>
					<p className={this.state.saveMessageStyle}>
						{this.state.saveMessage}
					</p>
				</td>
			</tr>
			
		let mealRows =
			<>
				<tr>
					<td>
						<label>Meal Name</label>
					</td>
					<td>
						<input
							className='user-input__input-box--large'
							onChange={this.onChangeMealName} 
							value={this.state.mealName}
						/>
					</td>
				</tr>
				<tr>
					<td colSpan='2'>
						<button onClick={this.saveMeal}>
							Save Meal
						</button>
					</td>
				</tr>
			</>

		if (this.context.error.createMeal){
			return (
				<>
					<button
						className='message__close-button'
						onClick={this.acknowledgeError}
						>x
					</button>
					<p className='message--error'>
						Error: Failed to add meal to database.
					</p>
				</>
			)
		} else if (this.state.locked){
			return (
				<p className='message--loading'>
					Adding meal to database...
				</p>
			)
		} else {
			return (
				<>
					<FoodItemSelector sendValue={this.addFoodObject} />
					<div
						className='create-meal__scrollbox'
						ref={this.state.currentMealRef}>
						<table className='food-table'>
							<tbody>
								{this.state.currentMealRows}
							</tbody>
						</table>
					</div>
					<table className='user-input__table--centered'>
						<tbody>
							{mealRows}
							{ this.state.saveMessage !== '' ?
								messageRow
							:
								null
							}
						</tbody>
					</table>
				</>
			)
		}
    }
}

export default CreateMeal