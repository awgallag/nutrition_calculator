// Import npm packages.
import React, { Component } from 'react'

// Import css classes.
import './../../styles/menu.css'

/* The OpenFeatures component renders a list of the open features of the webapp
	with information that can be toggled into view. */
class OpenFeatures extends Component {
	
	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayRDA: false,
			displayBrowseNutrientInfo: false,
			displaySortByNutrient: false,
			displayCreateAccount: false,
			rdaRef: React.createRef(),
			browseNutrientInfoRef: React.createRef(),
			sortByNutrientRef: React.createRef(),
			createAccountRef: React.createRef()
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
			if (currentDisplay === 'displayRDA'){
				currentRef = 'rdaRef'
			} else {
				currentRef = e.target.name.charAt(7).toLowerCase() +
					e.target.name.substring(8) + 'Ref'
			}
			
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
				<div ref={this.state.rdaRef}>
					<button
						name='displayRDA'
						className='menu__section-option'
						onClick={this.toggle}
						>View RDA Values
					</button>
					{ this.state.displayRDA ?
						<p className='menu__section-text'>
							Recommended Dietary Allowance (<i>RDA</i>) values
							tell you the quanitity of each essential nutrient
							that you should consume in order to meet your daily
							nutrient needs. By navigating to the <i>Essential
							Nutrients</i> section of the webapp and selecting
							your sex and age group you can view your <i>RDA</i>
							&nbsp;values.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.browseNutrientInfoRef}>
					<button
						name='displayBrowseNutrientInfo'
						className='menu__section-option'
						onClick={this.toggle}
						>Browse Nutrient Information
					</button>
					{ this.state.displayBrowseNutrientInfo ?
						<p className='menu__section-text'>
							After navigating to the <i>Nutrition Facts</i>
							&nbsp;section of the webapp a user can select any
							of the ninety-eight available food items to see
							the <i>nutrient breakdown</i> for a one hundred
							gram quantity of the selected food item.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.sortByNutrientRef}>
					<button
						name='displaySortByNutrient'
						className='menu__section-option'
						onClick={this.toggle}
						>Sort Food Items By Nutrient
					</button>
					{ this.state.displaySortByNutrient ?
						<p className='menu__section-text'>
							After navigating to the <i>Nutrition Facts</i>
							&nbsp;section of the webapp a user can select any
							of the nutrients found in the "Sort by" drop down
							menu to sort all of the available food items by the
							selected nutrient.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.createAccountRef}>
					<button
						name='displayCreateAccount'
						className='menu__section-option'
						onClick={this.toggle}
						>Create A User Account
					</button>
					{ this.state.displayCreateAccount ?
						<p className='menu__section-text'>
							A user can create an account at anytime by clicking
							on the log-in button, then clicking the create
							account button, and providing a desired username
							and password along with their sex and date of
							birth. A user must provide their sex and date of
							birth when creating an account so that the webapp
							can put them into an <i>essential nutrient
							catagory</i> in order to provide percentage values
							for their nutrient intake.
						</p>
					:
						null
					}
				</div>
			</>
        )
    }
}

export default OpenFeatures