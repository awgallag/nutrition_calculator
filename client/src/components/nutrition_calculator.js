// Import npm packages.
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// Import react components.
import AccountContext from './account/account_provider'
import About from './about/about'
import MyNutrition from './my nutrition/my_nutrition'
import MyMeals from './my meals/my_meals'
import NutritionFacts from './nutrition facts/nutrition_facts'
import EssentialNutrients from './essential nutrients/essential_nutrients'
import EditAccount from './edit account/edit_account'
import LoginOverlay from './login_overlay'

// Import css classes.
import './../styles/account_options.css'
import './../styles/banner.css'
import './../styles/navbar.css'

/* The nutritionCalculator component renders the webapp's navbar and the
	currently selected route. */
class NutritionCalculator extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.showOverlay = this.showOverlay.bind(this)
		this.hideOverlay = this.hideOverlay.bind(this)
		this.revealAccountOptions = this.revealAccountOptions.bind(this)
		this.hideAccountOptions = this.hideAccountOptions.bind(this)
		this.logout = this.logout.bind(this)
		
		this.state = {
			overlay: false,
			displayAccountOptions: false
		}
	}
	
	revealAccountOptions(){
		this.setState({
			displayAccountOptions: true
		})
	}
	
	hideAccountOptions(){
		this.setState({
			displayAccountOptions: false
		})
	}
	
	logout(){
		this.setState({
			displayAccountOptions: false
		},
		() => {
			this.context.logout()
		})
	}
	
	showOverlay() {
		this.setState({
			overlay: true
		})
	}
	
	hideOverlay() {
		this.setState({
			overlay: false
		})
	}
	
	componentDidMount() {
		this.context.confirmAuth()
	}

	render() {
		let accountButton
		
		if (this.context.authorized){
			if (this.state.displayAccountOptions){
				accountButton =
					<div
						onMouseEnter={this.revealAccountOptions}
						onMouseLeave={this.hideAccountOptions}
						className='account-options'>
						<button className='account-options__button--open'>
							account
						</button>
						<div className='account-options__option-box'>
							<Link
								to='/edit_account'
								className='account-options__option'
								onClick={this.hideAccountOptions}
								>edit
							</Link>
							<button
								className='account-options__option'
								onClick={this.logout}
								>log out
							</button>
						</div>
					</div>
			} else {
				accountButton =
					<div
						onMouseEnter={this.revealAccountOptions}
						onMouseLeave={this.hideAccountOptions}>
						<button className='account-options__button'>
							account
						</button>
					</div>
			}
		} else {
			accountButton =
				<button 
					className='account-options__button'
					onClick={this.showOverlay}
					>log in
				</button>
		}
		
		return (
			<Router>
				{ this.state.overlay ?
					<LoginOverlay hideOverlay={this.hideOverlay} />
				:
					null
				}
				<div>
					<Link
						to='/'
						className='banner'
						title='About'
						>Nutrition Calculator
					</Link>
				</div>
				<ul className='navbar'>
					{accountButton}
					<li>
						<Link
							to='/my_nutrition'
							className='navbar__item'
							>My Nutrition
						</Link>
					</li>
					<li>
						<Link
							to='/my_meals'
							className='navbar__item'
							>My Meals
						</Link>
					</li>
					<li>
						<Link
							to='/nutrition_facts'
							className='navbar__item'
							>Nutrition Facts
						</Link>
					</li>
					<li>
						<Link
							to='/essential_nutrients'
							className='navbar__item'
							>Essential Nutrients
						</Link>
					</li>
				</ul>
				<Route path='/' exact component={About} />
				<Route path='/my_nutrition' exact component={MyNutrition} />
				<Route path='/my_meals' exact component={MyMeals} />
				<Route path='/nutrition_facts' component={NutritionFacts} />
				<Route path='/essential_nutrients'
					component={EssentialNutrients} />
				<Route path='/edit_account' exact component={EditAccount} />
			</Router>
		)
	}
}

export default NutritionCalculator