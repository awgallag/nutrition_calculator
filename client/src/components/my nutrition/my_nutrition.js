// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'
import AddItemOrMeal from './add_item_or_meal'
import NutritionHistory from './nutrition_history'
import TodaysInfo from './todays_info'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The MyNutrition component provides options for user's to view and update
	their food records. */
class MyNutrition extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayAddItemOrMeal: false,
			displayTodaysFoodList: false,
			displayTodaysNutrition: false,
			displayNutritionHistory: false,
			addItemOrMealRef: React.createRef(),
			todaysFoodListRef: React.createRef(),
			todaysNutritionRef: React.createRef(),
			nutritionHistoryRef: React.createRef()
		}
	}

	/* The toggle method toggles a section open/closed when it is called by
		a button associated with the section. */
	toggle(e){
		e.preventDefault()
		let display = true
		let currentDisplay = e.target.name
		let currentRef = e.target.name.charAt(7).toLowerCase() +
			e.target.name.substring(8) + "Ref"
		
		// Closes section if it was open when toggle was called.
		if (this.state[currentDisplay]){
			display = false
		}
		
		// Scrolls section into view if it was closed when toggle was called.
		if (display){
			window.requestAnimationFrame(()=>{
				this.state[currentRef].current.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			})
		}
		
		this.setState({
			[currentDisplay]: display
		})
	}
	
	componentDidMount() {
		this.context.confirmAuth()
	}

	render() {
		if(this.context.authorized) {
			return (
				<div className='menu__container'>
					<br />
					<div ref={this.state.addItemOrMealRef}>
						<button
							name='displayAddItemOrMeal'
							className='menu__option' 
							onClick={this.toggle}
							>Add Food Item or Meal
						</button>
						{ this.state.displayAddItemOrMeal ?
							<div className='menu__section'>
								<AddItemOrMeal />
							</div>
						: 
							null
						}
					</div>
					<div ref={this.state.todaysFoodListRef}>
						<button
							name='displayTodaysFoodList'
							className='menu__option'
							onClick={this.toggle}
							>Todays Food List
						</button>
						{ this.state.displayTodaysFoodList ?
							<div className='menu__section'>
								<TodaysInfo type='foodList' />
							</div>
						: 
							null
						}
					</div>
					<div ref={this.state.todaysNutritionRef}>
						<button
							name='displayTodaysNutrition'
							className='menu__option'
							onClick={this.toggle}
							>Todays Nutrition
						</button>
						{ this.state.displayTodaysNutrition ?
							<div className='menu__section'>
								<TodaysInfo type='nutritionList' />
							</div>
						: 
							null
						}
					</div>
					<div ref={this.state.nutritionHistoryRef}>
						<button
							name='displayNutritionHistory'
							className='menu__option'
							onClick={this.toggle}
							>Nutrition History
						</button>
						{ this.state.displayNutritionHistory ?
							<div className='menu__section'>
								<NutritionHistory />
							</div>
						: 
							null
						}
					</div>
				</div>
			)
		} else {
			return (
				<>
					<p className='message--login'>
						Log-in to view your nutrition page.
					</p>
				</>
			)
		}
    }
}

export default MyNutrition