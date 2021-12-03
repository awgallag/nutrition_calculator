// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodInfo from './../tools/food_info'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The NutritionHistory component displays a list of all of the food records on
	the user account that the client is logged into. The food records can be
	togggled open or closed to reveal or hide the food list and nutrient
	breakdown for that food record. */
class NutritionHistory extends Component {
	static contextType = AccountRecordsContext

	constructor(props) {
        super(props)
		
		this.createFoodRecordLinks = this.createFoodRecordLinks.bind(this)
		this.addFoodRecordLink = this.addFoodRecordLink.bind(this)
		this.toggleFoodInfo = this.toggleFoodInfo.bind(this)
		this.removeFoodRecord = this.removeFoodRecord.bind(this)
		this.removeFoodRecordLink = this.removeFoodRecordLink.bind(this)
		this.scrollFoodRecord = this.scrollFoodRecord.bind(this)
		
		this.currentDateIndex = this.currentDateIndex.bind(this)
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			foodRecordLinks: [],
			foodRecordRefs: [],
			locked: false,
			removeIndex: -1
		}
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('nutritionHistory')
		})
	}
	
	/* The scrollFoodRecord method accepts a food record index as an argument
		and scrolls the food record located at that index into view. */
	scrollFoodRecord(currentFoodRecordIndex){
		window.requestAnimationFrame(()=>{
			this.state.foodRecordRefs[currentFoodRecordIndex]
				.current.scrollIntoView({
				behavior: 'smooth', 
				block: 'start' 
			})
		})
	}
	
	
	removeFoodRecord(foodRecordIndex){
		this.setState({
			locked: true,
			removeIndex: foodRecordIndex
		}, () => {
			this.context.removeFoodRecord(foodRecordIndex, 'nutritionHistory')
		})
	}
	
	/* The removeFoodRecordLink method removes the foodRecordLink located at
		the foodRecordIndex provided as an argument. */
	removeFoodRecordLink(foodRecordIndex){
		let currentFoodRecordLinks = []
		let currentFoodRecordRefs = []
		let previousLinks = this.state.foodRecordLinks
		let numItems = this.state.foodRecordLinks.length
		let state = null
		let index = 0

		// Removes food record link from current list of food record links.
		for (let i=0;i<numItems;i++){
			if (i !== parseInt(foodRecordIndex)){
				state = previousLinks[i].props.children[1]
				
				currentFoodRecordRefs.push(
					this.state.foodRecordRefs[i]
				)
				
				currentFoodRecordLinks.push(
					<div key={previousLinks[i].key} 
						ref={currentFoodRecordRefs[index]}>
						<button
							className='menu__section-option--date'
							name={index}
							onClick={this.toggleFoodInfo}
							>{previousLinks[i].key}
						</button>
						{ state === null ?
							null
						: 
							<FoodInfo
								recordType='foodRecord'
								index={index} 
								remove={this.removeFoodRecord}
								scroll={this.scrollFoodRecord}
							/>
						}
					</div>
				)
				index++
			}
		}
		
		this.setState({
			foodRecordLinks: currentFoodRecordLinks,
			foodRecordRefs: currentFoodRecordRefs,
			locked: false,
			removeIndex: -1
		})
	}

	/* The toggleFoodInfo method toggles the food record info open or closed
		for the food record associated with the button that called the
		method. */
	toggleFoodInfo(e){
		e.preventDefault()
		let currentFoodRecordLinks = this.state.foodRecordLinks
		let state = currentFoodRecordLinks[e.target.name].props.children[1]

		currentFoodRecordLinks[e.target.name] =
			<div
				key={e.target.innerText}
				ref={this.state.foodRecordRefs[e.target.name]}>
				<button
					className='menu__section-option--date'
					name={e.target.name}
					onClick={this.toggleFoodInfo}
					>{e.target.innerText}
				</button>
				{ state === null ? 
					<FoodInfo
						recordType='foodRecord'
						index={e.target.name} 
						remove={this.removeFoodRecord}
						scroll={this.scrollFoodRecord}
					/>
				:
					null
				}
			</div>

		this.setState({
			foodRecordLinks: currentFoodRecordLinks
		},
		() => {
			if (state === null){
				// Scrolls the food record information into view.
				window.requestAnimationFrame(()=>{
					this.state.foodRecordRefs[e.target.name].current
						.scrollIntoView({
						behavior: 'smooth', 
						block: 'start' 
					})
				})
			}
		})
	}
	
	/* The createFoodRecordLinks method creates a link for every food record in
		the user account that the client is logged into. The links can be used
		to toggle information about the food records open or closed. */
	createFoodRecordLinks(){
		let numItems = this.context.foodRecords.length
		let currentFoodRecordLinks = []
		let dateArray = []
		let dateString = ''
		let currentFoodRecordRefs = []
		
		for (let i=0;i<numItems;i++){
			currentFoodRecordRefs.push(React.createRef())
			dateArray = this.context.foodRecords[i].date.split('-')
			dateString = dateArray[1] + '/' + dateArray[2] + '/' +
				dateArray[0]
			currentFoodRecordLinks.push(
				<div
					key={dateString}
					ref={currentFoodRecordRefs[i]}>
					<button
						className='menu__section-option--date'
						name={i}
						onClick={this.toggleFoodInfo}
						>{dateString}
					</button>
					{null}
				</div>
			)
		}
		this.setState({
			foodRecordLinks: currentFoodRecordLinks,
			foodRecordRefs: currentFoodRecordRefs
		})
	}
	
	/* The addFoodRecordLink method adds the most recent food record added to
		the user account that the client is logged into to the current list of
		food record links. (This method is called when a new food record has
		been added to the user's account.) */
	addFoodRecordLink(){
		let index = this.context.foodRecords.length - 1
		let currentFoodRecord = this.context.foodRecords[index]
		let currentFoodRecordLinks = this.state.foodRecordLinks
		let currentFoodRecordRefs = this.state.foodRecordRefs
		
		let dateArray = currentFoodRecord.date.split('-')
		let dateString = dateArray[1] + '/' + dateArray[2] + '/' +
			dateArray[0]
		
		currentFoodRecordRefs.push(React.createRef())
		
		currentFoodRecordLinks.push(
			<div
				key={dateString}
				ref={currentFoodRecordRefs[index]}>
				<button 
					name={index}
					className='menu__section-option--date'
					onClick={this.toggleFoodInfo}
					>{dateString}
				</button>
				{null}
			</div>
		)

		this.setState({
			foodRecordLinks: currentFoodRecordLinks,
			foodRecordRefs: currentFoodRecordRefs
		})
	}
	
	currentDateIndex(){
		let today = new Date()
		let month = (parseInt(today.getMonth()) + 1)
		let day = parseInt(today.getDate())
		let currentDate = ''
		let records = this.state.foodRecordLinks
		let index = -1
		
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
		
		currentDate = month + '/' + day + '/' + today.getFullYear()
		
		for (let i=0; i<records.length;i++){
			if (records[i].key === currentDate){
				index = i
				break
			}
		}
		
		return index
	}
	
	componentDidMount() {
		this.createFoodRecordLinks()
	}

	componentDidUpdate() {
		let removeIndex = -1
		
		/* If a foodRecord was added to the user's foodRecords then add a
			link for the new food record. */
		if (this.state.foodRecordLinks.length < 
			this.context.foodRecords.length)
		{
			this.addFoodRecordLink()
		}
			
		if (this.state.foodRecordLinks.length > 
			this.context.foodRecords.length)
		{
			if (this.state.locked){
				/* If the removeFoodRecord method successfully removed
					foodRecord from database, remove it from component. */
					if (this.state.removeIndex !== -1){
						this.removeFoodRecordLink(this.state.removeIndex)
					}
			} else {
				/* If today's foodRecord was removed through today's food list,
					then remove today's food record from component. */
				removeIndex = this.currentDateIndex()
				if (removeIndex !== -1) {
					this.removeFoodRecordLink(removeIndex)
				}
			}
		}
	}

	render() {
		if (this.context.error.nutritionHistory){
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
		} else {
			return (
				<div>
					{ this.state.foodRecordLinks.length === 0 ?
						<p className='menu__section-text'>
							No nutrition history available
						</p>
					:
						this.state.foodRecordLinks
					}
				</div>
			)
		}
    }

}

export default NutritionHistory