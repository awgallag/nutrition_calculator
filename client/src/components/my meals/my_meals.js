// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'
import CreateMeal from './create_meal'
import ViewMeals from './view_meals'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The MyMeals component provides the options for a user to create new meals
	for their account or to view the meals that they already have on their
	account. */
class MyMeals extends Component {
	static contextType = AccountContext

	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayCreateMeal: false,
			displayViewMeals: false,
			displayMessage: false,
			viewMealsRef: React.createRef(),
			createMealRef: React.createRef()
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
		if(this.context.authorized){
			return (
				<div className='menu__container'>
					<br />
					<div ref={this.state.createMealRef}>
						<button
							name='displayCreateMeal'
							className='menu__option'
							onClick={this.toggle}
							>Create New Meal
						</button>
						{ this.state.displayCreateMeal ?
							<div className='menu__section'>
								<CreateMeal />
							</div>
						:
							null
						}
					</div>
					<div ref={this.state.viewMealsRef}>
						<button
							name='displayViewMeals'
							className='menu__option'
							onClick={this.toggle}
							>View Meals
						</button>
						{ this.state.displayViewMeals ?
							<div className='menu__section'>
								<ViewMeals />
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
						Log-in to view your meal page.
					</p>
				</>
			)
		}
    }
}

export default MyMeals