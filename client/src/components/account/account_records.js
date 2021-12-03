// Import npm packages.
import React, { Component } from 'react'
import axios from 'axios'

// Import react context components.
import AccountContext from './account_provider'

const AccountRecordsContext = React.createContext()

/* The AccountRecordsProvider component provides other components with methods
	to: add, remove, or update records from the user account that the client is
	logged into. */
class AccountRecordsProvider extends Component {
	static contextType = AccountContext
	
	constructor(props) {
        super(props)
		
		this.addMeal = this.addMeal.bind(this)
		this.removeMeal = this.removeMeal.bind(this)
		
		this.addFoodRecord = this.addFoodRecord.bind(this)
		this.removeFoodRecord = this.removeFoodRecord.bind(this)
		this.addObjectToRecord = this.addObjectToRecord.bind(this)
		this.removeObjectFromRecord = this.removeObjectFromRecord.bind(this)
		
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			createMeal: false,
			viewMeals: false,
			addItem: false,
			nutritionHistory: false,
			todaysInfo: false,
			foodList: false
		}
	}
	
	acknowledgeError(callingComponent){
		this.setState({
			[callingComponent]: false
		})
	}
	
	/* The addMeal method adds the mealObject passed in as an argument to the
		user account that the client is logged into. */
	addMeal(mealObject, callingComponent){
		let currentMeals = this.context.meals
		
		axios.post('meals/addMeal', mealObject)
			.then(() => {
				currentMeals.push(mealObject)
				this.context.setMeals(currentMeals)
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}
	
	/* The removeMeal method removes the meal located at the mealIndex passed
		in as an argument from the user account that the client is logged
		into. */
	removeMeal(mealIndex, callingComponent){
		let currentMeals = []
		let previousMeals = this.context.meals
		
		axios.post('/meals/removeMeal', this.context.meals[mealIndex])
			.then(() => {
				for (let i=0;i<previousMeals.length;i++){
					if (i !== parseInt(mealIndex)){
						currentMeals.push(previousMeals[i])
					}
				}
				
				this.context.setMeals(currentMeals)
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}
	
	/* The addFoodRecord method creates a new food record with the foodObject
		and currentDate parameters and adds the new food record to the user
		account that the client is logged into. */
	addFoodRecord(foodObject, currentDate, callingComponent){
		let updatedFoodRecords = this.context.foodRecords
		let currentRecord = [foodObject]
		let foodRecord = {
			date: currentDate,
			record: currentRecord
		}

		axios.post('/foodRecord/createFoodRecord', foodRecord)
			.then(() => {
				updatedFoodRecords.push(foodRecord)
				this.context.setFoodRecords(updatedFoodRecords)
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}
	
	/* The addObjectToRecord method adds the given foodObject to the food
		record located at the provided foodRecordIndex to the user account
		that the client is logged into. */
	addObjectToRecord(foodObject, foodRecordIndex, callingComponent){
		let updatedFoodRecords = this.context.foodRecords
		let foodRecord = updatedFoodRecords[foodRecordIndex]
		
		foodRecord.record.push(foodObject)
		
		axios.post('/foodRecord/updateFoodRecord', foodRecord)
			.then(() => {
				updatedFoodRecords[foodRecordIndex] = foodRecord
				this.context.setFoodRecords(updatedFoodRecords)
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}

	/* The removeFoodRecord method removes the food record located at the
		provided foodRecordIndex from the user account that the client is
		logged into. */
	removeFoodRecord(foodRecordIndex, callingComponent){
		let updatedFoodRecords = []
		
		axios.post('/foodRecord/removeFoodRecord',
			this.context.foodRecords[foodRecordIndex])
			.then(() => {
				for (let i=0; i<this.context.foodRecords.length; i++){
					if (i !== parseInt(foodRecordIndex)){
						updatedFoodRecords.push(this.context.foodRecords[i])
					}
				}
				this.context.setFoodRecords(updatedFoodRecords)	
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}

	/* The removeObjectFromRecord method removes the food object located at the
		given objectIndex in the food record located at the provided
		foodRecordIndex from the user account that the client is logged
		into. */
	removeObjectFromRecord(objectIndex, foodRecordIndex, callingComponent){
		let updatedFoodRecords = this.context.foodRecords
		let currentFoodRecord = this.context.foodRecords[foodRecordIndex]
		let newRecord = []
		let numItems = currentFoodRecord.record.length
		
		for (let i=0;i<numItems;i++){
			 if (i !== parseInt(objectIndex)){
				newRecord.push(currentFoodRecord.record[i])
			 }
		}
		
		currentFoodRecord.record = newRecord
		
		axios.post('/foodRecord/updateFoodRecord', currentFoodRecord)
			.then(() => {
				updatedFoodRecords[foodRecordIndex] = currentFoodRecord
				this.context.setFoodRecords(updatedFoodRecords)
			})
			.catch(() => {
				this.setState({
					[callingComponent]: true
				})
			})
	}

	render() {
		let currentErrors = {
			createMeal: this.state.createMeal,
			viewMeals: this.state.viewMeals,
			addItem: this.state.addItem,
			nutritionHistory: this.state.nutritionHistory,
			todaysInfo: this.state.todaysInfo,
			foodList: this.state.foodList
		}
		
        return (
			<AccountRecordsContext.Provider
				value={{
					meals: this.context.meals,
					foodRecords: this.context.foodRecords,
					error: currentErrors,
					addMeal: this.addMeal,
					removeMeal: this.removeMeal,
					addFoodRecord: this.addFoodRecord,
					removeFoodRecord: this.removeFoodRecord,
					addObjectToRecord: this.addObjectToRecord,
					removeObjectFromRecord: this.removeObjectFromRecord,
					acknowledgeError: this.acknowledgeError
				}}>
				{this.props.children}
			</AccountRecordsContext.Provider>
        )
    }
}

export default AccountRecordsContext
export { AccountRecordsProvider }