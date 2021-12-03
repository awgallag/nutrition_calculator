// Import npm packages.
import React, { Component } from 'react'

// Import css classes.
import './../../styles/menu.css'

/* The Glossary component renders nutrition calculator glossary terms
	with definitions that can be toggled into view. */
class Glossary extends Component {
	
	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayEssentialNutrientCategory: false,
			displayFoodRecord: false,
			displayMeal: false,
			displayNutrientBreakdown: false,
			displayNutrientIntake: false,
			displayRDA: false,
			essentialNutrientCategoryRef: React.createRef(),
			foodRecordRef: React.createRef(),
			mealRef: React.createRef(),
			nutrientBreakdownRef: React.createRef(),
			nutrientIntakeRef: React.createRef(),
			rdaRef: React.createRef()
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
				<div ref={this.state.essentialNutrientCategoryRef}>
					<button
						name='displayEssentialNutrientCategory'
						className='menu__section-option'
						onClick={this.toggle}
						>Essential Nutrient Category
					</button>
					{ this.state.displayEssentialNutrientCategory ?
						<p className='menu__section-text'>
							An <i>essential nutrient category</i> is a group
							that an individual belongs to based on their sex
							and age which defines their nutritional needs.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.foodRecordRef}>
					<button
						name='displayFoodRecord'
						className='menu__section-option'
						onClick={this.toggle}
						>Food Record
					</button>
					{ this.state.displayFoodRecord ?
						<p className='menu__section-text'>
							A <i>food record</i> is a list of meals and food
							items with their associated quantities that are all
							attached to a specific date.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.mealRef}>
					<button
						name='displayMeal'
						className='menu__section-option'
						onClick={this.toggle}
						>Meal
					</button>
					{ this.state.displayMeal ?
						<p className='menu__section-text'>
							A <i>meal</i> is a list of food items with their
							associated quantities.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.nutrientBreakdownRef}>
					<button
						name='displayNutrientBreakdown'
						className='menu__section-option'
						onClick={this.toggle}
						>Nutrient Breakdown
					</button>
					{ this.state.displayNutrientBreakdown ?
						<p className='menu__section-text'>
							A <i>nutrient breakdown</i> is a list of nutrients
							with associated quantities.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.nutrientIntakeRef}>
					<button
						name='displayNutrientIntake'
						className='menu__section-option'
						onClick={this.toggle}
						>Nutrient Intake
					</button>
					{ this.state.displayNutrientIntake ?
						<p className='menu__section-text'>
							An individual's <i>nutrient intake</i> is the
							amount of nutrients that they have consumed within
							a day.
						</p>
					:
						null
					}
				</div>
				<div ref={this.state.rdaRef}>
					<button
						name='displayRDA'
						className='menu__section-option'
						onClick={this.toggle}
						>RDA
					</button>
					{ this.state.displayRDA ?
						<p className='menu__section-text'>
							<i>Recommended Dietary Allowances (RDA)</i> are
							guidelines for the quantity of each essential
							nutrient that an individual needs on a daily basis
							to be healthy.
						</p>
					:
						null
					}
				</div>
			</>
        )
    }
}

export default Glossary