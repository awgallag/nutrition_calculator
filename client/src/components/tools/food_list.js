// Import npm packages.
import React, { Component } from 'react'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/food_table.css'
import './../../styles/message.css'

/*
	The FoodList component displays the list of food items in a food record or
	a meal. (If the FoodList is given a food record then options to remove food
	items from the record are included in the food list.)
	
	props:
	index - The index location of the food record or meal in the user context
		foodRecords or meals list.
	recordType - 'meal' indicates the record index is for a meal, otherwise the
		record is assumed to be a food record.
	remove - function that removes a specific food object from the food record.
		(only used when recordType is not 'meal'.)
*/
class FoodList extends Component {
	static contextType = AccountRecordsContext
	
	constructor(props) {
        super(props)
		
		this.updateFoodList = this.updateFoodList.bind(this)
		this.removeFoodObject = this.removeFoodObject.bind(this)
		
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			foodList: [],
			locked: false
		}
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('foodList')
		})
	}
	
	/* The removeFoodObject method removes the foodObject associated with the
		button that called the method from the food record being displayed. If
		the foodObject being removed is the last foodObject in the food record
		than the entire food record is removed from the user's acount. */
	removeFoodObject(e){
		let foodRecordIndex = this.props.index
		let objectIndex = e.target.name
		
		/* Prevent removeFoodObject from being called before it is finished
			with previous call. (basically works as a semaphore) */
		this.setState({
			locked: true
		}, () => {
			if (this.state.foodList.length === 1){
				this.props.remove(foodRecordIndex)
			} else {
				this.context.removeObjectFromRecord(objectIndex,
					foodRecordIndex, 'foodList')
			}
		})
	}
	
	/* The updateFoodList method creates table rows for each food item in the
		meal or food record whose index was passed down by the parent component
		as a prop. */
	updateFoodList(){
		let currentFoodList = []
		let foodObject
		let foodRecord = true
		let numItems = 0
		let foodTitle
		let foodJSX
		
		if (this.props.recordType === 'meal'){
			numItems = this.context.meals[this.props.index].foodObjects.length
			foodRecord = false
		} else {
			numItems = this.context.foodRecords[this.props.index].record.length
		}
		
		if (foodRecord){
			for (let i=0;i<numItems;i++){
				foodObject =
					this.context.foodRecords[this.props.index].record[i]
				
				if (foodObject.foodItem === undefined){
					foodTitle = foodObject.mealName
					foodJSX = 
						<td
							className='food-table__td'
							colSpan='2'
							>{foodTitle}
						</td>
				} else {
					foodTitle = foodObject.item
					foodJSX =
						<>
							<td className='food-table__td'>
								{foodObject.foodItem}
							</td>
							<td>
								{foodObject.quantity}g
							</td>
						</>
				}
				
				currentFoodList.push(
					<tr
						key={foodTitle+(i+1).toString()}
						className='food-table__tr'>
						{foodJSX}
						<td>
							<button
								onClick={this.removeFoodObject}
								name={i}
								title='remove item'
								className='food-table__remove-button'
								>x
							</button>
						</td>
					</tr>
				)
			}
		} else {
			for (let i=0;i<numItems;i++){
				foodObject =
					this.context.meals[this.props.index].foodObjects[i]

				currentFoodList.push(
					<tr
						key={foodObject.foodItem+(i+1).toString()}
						className='food-table__tr'>
						<td className='food-table__td'>
							{foodObject.foodItem}
						</td>
						<td>
							{foodObject.quantity}g
						</td>
					</tr>
				)
			}
		}
		
		this.setState({
			foodList: currentFoodList,
			locked: false
		})
	}
	
	componentDidMount(){
		this.updateFoodList()
	}

	/* The componentDidUpdate function updates the food list if the food record
		or meal being displayed was changed by another part of the webapp. */
	componentDidUpdate(){
		let validRecord = true
		let currentLength = 0
		
		if (this.props.recordType === 'meal'){
			if (this.context.meals[this.props.index] === undefined){
				validRecord = false
			} else {
				currentLength = 
					this.context.meals[this.props.index].foodObjects.length
			}			
		} else {
			if(this.context.foodRecords[this.props.index] === undefined){
				validRecord = false
			} else {
				currentLength = 
					this.context.foodRecords[this.props.index].record.length
			}
		}
		
		if (validRecord && (currentLength !== this.state.foodList.length)){
			this.updateFoodList()
		}
	}
	
	render() {
		if (this.context.error.foodList){
			return (
				<>
					<button
						className='message__close-button'
						onClick={this.acknowledgeError}
						>x
					</button>
					<p className='message--error'>
						Error: Failed to remove food item from record.
					</p>
				</>
			)
		} else if (this.state.locked){
			return (
				<p className='message--loading'>
					Removing food item from database...
				</p>
			)
		} else {
			return (
				<div style={
						this.props.addSpacers === true &&
						this.state.foodList.length === 1 ?
							{'paddingBottom':'50px'}
						:
							{'paddingBottom':'0px'}
						}>
					<table className='food-table'>
						<tbody>
							{this.state.foodList}
						</tbody>
					</table>
				</div>
			)
		}
    }
}

export default FoodList