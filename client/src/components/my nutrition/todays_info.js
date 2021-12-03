// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodList from './../tools/food_list'
import NutritionList from './../tools/nutrition_list'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The TodaysInfo component displays the food list or nutrition breakdown for
	the current date. If the type prop is set to foodList then the food list is
	displayed, otherwise the nutrition breakdown is displayed. */
class TodaysInfo extends Component {
	static contextType = AccountRecordsContext
	
	constructor(props){
		super(props)
		
		this.setFoodRecordIndex = this.setFoodRecordIndex.bind(this)
		this.removeFoodRecord = this.removeFoodRecord.bind(this)
		
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			recordIndex: 0,
			recordAvailable: false,
			numRecords: 0,
			locked: false
		}
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('todaysInfo')
		})
	}
	
	/* The setFoodRecordIndex method finds the food record for the current
		date and then sets the recordIndex state variable with that value. 
		If there is no record for the current date the recordAvailable state
		variable will be set to false. */
	setFoodRecordIndex(){
		let today = new Date()
		let month = (parseInt(today.getMonth()) + 1)
		let day = parseInt(today.getDate())
		let currentNumRecords = this.context.foodRecords.length
		let currentDate = ''
		let index = 0
		let available = false
		
		// Format today's date string.
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
		
		// Check if there is a food record for today's date.
		for (let i=0;i<this.context.foodRecords.length;i++){
			if (this.context.foodRecords[i].date === currentDate){
				index = i
				available = true
			}
		}
		
		this.setState({
			recordIndex: index,
			recordAvailable: available,
			numRecords: currentNumRecords,
			locked: false
		})
	}
	
	/* The removeFoodRecord method accepts a food record index as an argument
		and removes the food record located at that index from the user's
		account. */
	removeFoodRecord(foodRecordIndex){
		this.setState({
			locked: true
		}, () => {
			this.context.removeFoodRecord(foodRecordIndex, 'todaysInfo')
		})
	}
	
	componentDidMount(){
		this.setFoodRecordIndex()
	}
	
	componentDidUpdate(){
		if (this.context.foodRecords.length !== this.state.numRecords){
			this.setFoodRecordIndex()
		}
	}
	
	render() {
		if (this.props.type === 'foodList' && this.context.error.todaysInfo){
			return (
				<>
					<button
						className='message__close-button'
						onClick={this.acknowledgeError}
						>x
					</button>
					<p className='message--error'>
						Error: Failed to remove food record from database.
					</p>
				</>
			)	
		} else if (this.state.locked){
			return (
				<p className='message--loading'>
					Removing food record from database...
				</p>
			)	
		} else if (this.state.recordAvailable){
			if (this.props.type === 'foodList'){
				return (
					<>
						<br />
						<FoodList 
							recordType='foodRecord' 
							index={this.state.recordIndex} 
							remove={this.removeFoodRecord}
							/>
						<br />
					</>
				)
			} else {
				return (
					<>
						<NutritionList
							recordType='foodRecord'
							index={this.state.recordIndex}
						/>
					</>
				)		
			}
		} else {
			return (
				<p className='menu__section-text'>
					No food items have been added to today's food record.
				</p>
			)
		}
    }

}

export default TodaysInfo