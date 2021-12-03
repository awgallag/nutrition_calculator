// Import npm packages.
import React, { Component } from 'react'

// Import css classes.
import './../../styles/menu.css'

/* The UserFeatures component renders a list of the user features of the webapp
	with information that can be toggled into view. */
class UserFeatures extends Component {
	
	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayCreateCustomMeals: false,
			displayCreateFoodRecord: false,
			displayEditUser: false,
			displayDeleteUser: false,
			createCustomMealsRef: React.createRef(),
			createFoodRecordRef: React.createRef(),
			editUserRef: React.createRef(),
			deleteUserRef: React.createRef()
		}
	}
	
	/* The toggle method toggles a section open/closed when it is called by
		a button associated with the section. */
	toggle(e){
		e.preventDefault()
		let display = true
		let currentDisplay = e.target.name
		let currentRef = ''
		
		// Closes section if it was open when toggle was called.
		if (this.state[currentDisplay]){
			display = false
		}
		
		// Scrolls section into view if it was closed when toggle was called.
		if (display){
			currentRef = e.target.name.charAt(7).toLowerCase() +
				e.target.name.substring(8) + 'Ref'
			
			window.requestAnimationFrame(()=>{
				this.state[currentRef].current.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				})
			})
		}
		
		this.setState({
			[currentDisplay]: display
		})
	}
	
	render() {
        return (
			<>
				<div ref={this.state.createCustomMealsRef}>
					<button
						name='displayCreateCustomMeals'
						className='menu__section-option'
						onClick={this.toggle}
						>Create Custom Meals
					</button>
					{ this.state.displayCreateCustomMeals ?
						<p className='menu__section-text'>
							After logging into a user account and navigating to
							the <i>My Meals</i> section of the webapp a
							"Create New Meal" option will be revealed. Clicking
							on the "Create New Meal" option opens a work area
							where a user can combine any of the provided food
							items with their respective quantities to create a
							custom meal. Once all desired food items have been
							added to the meal, all that is left is for the user
							to choose a unique name for the meal and hit the
							"Save Meal" button. Creating meals makes it easier
							for users to create <i>food records</i> that are
							used to keep track of their daily <i>nutrient
							intakes</i>; users can also view the <i>nutrient
							breakdown</i> of any meal that they create.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.createFoodRecordRef}>
					<button
						name='displayCreateFoodRecord'
						className='menu__section-option'
						onClick={this.toggle}
						>Create Food Records
					</button>
					{ this.state.displayCreateFoodRecord ?
						<p className='menu__section-text'>
							After logging into a user account and navigating to
							the <i>My Nutrition</i> section of the webapp an
							"Add Food Item or Meal" option will be revealed.
							Clicking on the "Add Food Item or Meal" option
							opens a work area where a user can either add a
							food item with a quantity or a meal to a particular
							date. The first time that a food item or meal is
							added to a particular date a new <i>food record</i>
							&nbsp;is created for that date. <i>Food records</i>
							&nbsp;contain all of the food items with their
							respective quantities and meals that have been
							added to a specific date. The food list and
							<i>nutrient breakdown</i> for any of a user's
							<i>food records</i> can be viewed at any time by
							going to the <i>My Nutrition</i> section of the
							webapp and clicking on the "Nutrition History"
							option.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.editUserRef}>
					<button
						name='displayEditUser'
						className='menu__section-option'
						onClick={this.toggle}
						>Edit User Account
					</button>
					{ this.state.displayEditUser ?
						<p className='menu__section-text'>
							After logging into a user account and hovering over
							the "account" button on the right side of the
							navbar, an "edit" button will be revealed. Clicking
							on the "edit" button brings a user to the <i>Edit
							</i> section of the webapp. Within the edit section
							of the webapp a user can change their: username,
							sex, date of birth, or password.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.deleteUserRef}>
					<button
						name='displayDeleteUser'
						className='menu__section-option'
						onClick={this.toggle}
						>Delete User Account
					</button>
					{ this.state.displayDeleteUser ?
						<p className='menu__section-text'>
							After logging into a user account and hovering over
							the "account" button on the right side of the
							navbar, an "edit" button will be revealed. Clicking
							on the "edit" button brings a user to the <i>Edit
							</i> section of the webapp. In the edit section of
							the webapp there is a "Delete Account" option. If a
							user selects the "Delete Account" option, enters
							their password, and then clicks the
							"delete account" button, the users account will be
							permanently deleted from the webapp.
						</p>
					:
						null
					}
				</div>
			</>
        )
    }
}

export default UserFeatures