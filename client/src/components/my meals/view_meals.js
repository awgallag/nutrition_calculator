// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodInfo from './../tools/food_info'

// Import react context components.
import AccountRecordsContext from './../account/account_records'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The ViewMeals component displays a list of all of the meals on the user
	account that the client is logged into. The meals can be toggled open
	or closed to reveal or hide the food list and nutrient breakdown of the
	meals. */
class ViewMeals extends Component {
	static contextType = AccountRecordsContext
	
	constructor(props){
		super(props)
		
		this.toggleFoodInfo = this.toggleFoodInfo.bind(this)
		this.createMealLinks = this.createMealLinks.bind(this)
		this.removeMeal = this.removeMeal.bind(this)
		this.removeMealLink = this.removeMealLink.bind(this)
		this.addMealLink = this.addMealLink.bind(this)
		this.scrollCurrentMeal = this.scrollCurrentMeal.bind(this)
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			mealLinks: [],
			mealRefs: [],
			locked: false,
			removeMealIndex: 0,
			errorMessage: ''
		}
	}
	
	acknowledgeError(){
		this.setState({
			locked: false
		}, () => {
			this.context.acknowledgeError('viewMeals')
		})
	}
	
	/* The scrollCurrentMeal method accepts a meal index as an argument and
		scrolls the meal located at that index into view. */
	scrollCurrentMeal(currentMealIndex){
		window.requestAnimationFrame(()=>{
			this.state.mealRefs[currentMealIndex]
				.current.scrollIntoView({
					behavior: 'smooth', 
					block: 'start' 
				})
		})
	}
	
	/* The toggleFoodInfo method toggles the meal info open or closed for the
		meal associated with the button that called the method. */
	toggleFoodInfo(e){
		e.preventDefault()
		let currentMealIndex = e.target.name
		let currentMealName = e.target.innerText
		let currentMealLinks = this.state.mealLinks
		let state = currentMealLinks[currentMealIndex].props.children[1]
		
		currentMealLinks[currentMealIndex] =
			<div key={currentMealName}
				ref={this.state.mealRefs[currentMealIndex]}>
				<button
					className='menu__section-option'
					name={currentMealIndex} 
					onClick={this.toggleFoodInfo}>
					{currentMealName}
				</button>
				{ state === null ?
					<FoodInfo
						recordType='meal'
						index={currentMealIndex} 
						remove={this.removeMeal}
						scroll={this.scrollCurrentMeal}
					/>
				: 
					null
				}
			</div>

		this.setState({
			mealLinks: currentMealLinks
		},
		() => {
			if (state === null){
				// Scrolls the meal information into view.
				window.requestAnimationFrame(()=>{
					this.state.mealRefs[currentMealIndex]
						.current.scrollIntoView({
							behavior: 'smooth', 
							block: 'start' 
						})
				})
			}
		})
	}
	
	/* The removeMeal method accepts a meal index as an argument and removes
		the meal located at that index from the user account that the client is
		logged into. */
	removeMeal(mealIndex){
		this.setState({
			locked: true,
			removeMealIndex: mealIndex
		}, () => {
			this.context.removeMeal(mealIndex, 'viewMeals')
		})
	}
	
	/* The removeMealLink method removes the meal located at the state's
		removeMealIndex from the list of meal links. */
	removeMealLink(){
		let currentMealLinks = []
		let currentMealRefs = []
		let currentMealName = ''
		let mealIndex = this.state.removeMealIndex
		let state = null
		
		for (let i=0;i<this.state.mealLinks.length;i++){
			if (i<mealIndex){
				currentMealRefs.push(this.state.mealRefs[i])
				currentMealLinks.push(this.state.mealLinks[i])
			} else if (i>mealIndex){
				state = this.state.mealLinks[i].props.children[1]
				currentMealName = this.state.mealLinks[i].key
				currentMealRefs.push(this.state.mealRefs[i-1])
				currentMealLinks.push(
					<div key={currentMealName}
						ref={currentMealRefs[i-1]}>
						<button
							className='menu__section-option'
							name={i-1} 
							onClick={this.toggleFoodInfo}>
							{currentMealName}
						</button>
						{ state === null ? 
							null
						: 
							<FoodInfo
								recordType='meal'
								index={i-1}
								remove={this.removeMeal}
								scroll={this.scrollCurrentMeal}
							/>
						}
					</div>
				)
			}
		}
		
		this.setState({
			mealLinks: currentMealLinks,
			mealRefs: currentMealRefs,
			locked: false
		})
	}
	
	/* The addMealLink method adds the last meal added to the user account that
		the client is logged into to the current list of meal links. (This
		method is called when a new meal has been added to the user's
		account.) */
	addMealLink(){
		let currentMealLinks = this.state.mealLinks
		let mealIndex = this.state.mealLinks.length
		let currentMealRefs = this.state.mealRefs
		
		currentMealRefs.push(React.createRef())
		
		currentMealLinks.push(
			<div
				key={this.context.meals[mealIndex].mealName}
				ref={currentMealRefs[mealIndex]}>
				<button
					className='menu__section-option'
					name={mealIndex} 
					onClick={this.toggleFoodInfo}
					>{this.context.meals[mealIndex].mealName}
				</button>
				{null}
			</div>
		)
		
		this.setState({
			mealLinks: currentMealLinks,
			mealRefs: currentMealRefs
		})
	}
	
	/* The createMealLinks method creates a link for every meal in the user
		account that the client is logged into. The links can be used to
		toggle information about the meals open or closed. */
	createMealLinks(){
		let currentMealLinks = []
		let currentMealRefs = []
		
		for (let i=0;i<this.context.meals.length;i++){
			currentMealRefs.push(React.createRef())
			
			currentMealLinks.push(
				<div
					key={this.context.meals[i].mealName}
					ref={currentMealRefs[i]}>
					<button
						className='menu__section-option'
						name={i} 
						onClick={this.toggleFoodInfo}
						>{this.context.meals[i].mealName}
					</button>
					{null}
				</div>
			)
		}
		
		this.setState({
			mealLinks: currentMealLinks,
			mealRefs: currentMealRefs
		})
	}
	
	componentDidMount(){
		this.createMealLinks()
	}
	
	componentDidUpdate(){
		if (this.state.locked){
			if (this.context.meals.length < this.state.mealLinks.length){
				this.removeMealLink()
			}
		} else {
			if (this.context.meals.length > this.state.mealLinks.length){
				this.addMealLink()
			}
		}
	}
	
	render() {
		if (this.context.error.viewMeals) {
			return(
				<>
					<button
						className='message__close-button'
						onClick={this.acknowledgeError}
						>x
					</button>
					<p className='message--error'>
						Error: Failed to remove meal from database.
					</p>
				</>
			)
		} else if (this.state.locked){
			return (
				<p className='message--loading'>
					Removing meal from database...
				</p>
			)
		} else {
			return (
				<>
					{ this.state.mealLinks.length === 0 ?
						<p className='menu__section-text'>
							No Meals Available.
						</p>
					:
						this.state.mealLinks
					}
				</>
			)
		}
    }
}

export default ViewMeals