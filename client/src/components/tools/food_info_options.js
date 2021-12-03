// Import npm packages.
import React, { Component } from 'react'

// Import css classes.
import './../../styles/options.css'

/* The FoodInfoOptions component provides options to view the: food list,
	nutrition values, or nutrition percentages for a food record or meal. The
	component also provides an option for the user to delete the food record or
	meal from their account. */
class FoodInfoOptions extends Component {
	
	constructor(props) {
        super(props)
		
		this.setDisplay = this.setDisplay.bind(this)
		this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this)
		this.remove = this.remove.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onMouseEnter = this.onMouseEnter.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)
		this.onBlur = this.onBlur.bind(this)
		
		this.state = {
			currentRadioButtonName: '',
			foodListId: '',
			nutritionValuesId: '',
			nutritionPercentagesId: '',
			removeButtonText: '',
			optionsMenu: 'options__menu--hidden',
			optionsText: <>Options &nbsp; &nbsp; &nbsp; ▼</>,
			selectedOption: 'Food List',
			mouseInDiv: false
		}
	}
	
	onChange(e){
		this.setState({
			selectedOption: e.target.value
		},
		this.setDisplay(e)
		)
	}
	
	setDisplay(e){
		this.props.setDisplay(e.target.value)
	}
	
	remove(){
		this.props.remove(this.props.index)
	}
	
	onMouseLeave(){
		this.setState({
			mouseInDiv: false
		})
	}
	
	onMouseEnter(){
		this.setState({
			mouseInDiv: true
		})
	}
	
	onBlur(){
		if (this.state.mouseInDiv === false){
			this.setState({
				optionsMenu: 'options__menu--hidden',
				optionsText: <>Options &nbsp; &nbsp; &nbsp; ▼</>
			})
		}
	}
	
	/* The toggleOptionsMenu method toggles the options menu open or closed. */
	toggleOptionsMenu(e){
		let currentOptionsMenu = 'options__menu--hidden'
		let currentOptionsText = <>Options &nbsp; &nbsp; &nbsp; ▼</>
		
		if (currentOptionsMenu === this.state.optionsMenu){
			currentOptionsMenu = 'options__menu--active'
			currentOptionsText = <>Options &nbsp; &nbsp; &nbsp; ▲</>
		}
		
		this.setState({
			optionsMenu: currentOptionsMenu,
			optionsText: currentOptionsText
		})
	}
	
	componentDidMount(){
		let currentRadioButtonName = this.props.index
		let currentFoodListId = 'foodList_' + this.props.index
		let currentNutritionValuesId = 'nutritionValues_' + this.props.index
		let currentNutritionPercentagesId = 'nutritionPercentages_' +
			this.props.index
		let currentRemoveButtonText = ''
		
		if (this.props.recordType === 'meal'){
			currentRemoveButtonText = 'Remove Meal'
		} else {
			currentRemoveButtonText = 'Remove Record'
		}
		
		this.setState({
			radioButtonName: currentRadioButtonName,
			foodListId: currentFoodListId,
			nutritionValuesId: currentNutritionValuesId,
			nutritionPercentagesId : currentNutritionPercentagesId,
			removeButtonText: currentRemoveButtonText,
		})
	}

	render() {
		let foodListRadioButton =
			<input
				type="radio"
				name={this.state.radioButtonName}
				value="Food List"
				className='options__radio-button' 
				id={this.state.foodListId}
				onChange={this.onChange}
				checked={this.state.selectedOption === 'Food List'}
			/>
		
		let nutritionPercentagesRadioButton =
			<input
				type="radio" 
				name={this.state.radioButtonName}
				value="Nutrition Percentages"
				className='options__radio-button'
				id={this.state.nutritionValuesId} 
				onChange={this.onChange}
				checked={this.state.selectedOption === 'Nutrition Percentages'}
			/>
		
		let nutritionValuesRadioButton =
			<input
				type="radio" 
				name={this.state.radioButtonName}
				value="Nutrition Values"
				className='options__radio-button'
				id={this.state.nutritionPercentagesId}
				onChange={this.onChange} 
				checked={this.state.selectedOption === 'Nutrition Values'}
			/>
			
		let foodListLabel =
			<label
				htmlFor={this.state.foodListId}
				className='options__radio-button'
				>Food List
			</label>
			
		let nutritionPercentagesLabel =
			<label
				htmlFor={this.state.nutritionValuesId}
				className='options__radio-button'
				>Nutrition Percentages
			</label>
			
		let nutritionValuesLabel =
			<label
				htmlFor={this.state.nutritionPercentagesId}
				className='options__radio-button'
				>Nutrition Values
			</label>
		
		return (
			<div
				className='options__container'
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onBlur={this.onBlur}
				tabIndex='0'>
				<button
					className='options__button'
					onClick={this.toggleOptionsMenu}
					>{this.state.optionsText}
				</button>
				<div className={this.state.optionsMenu}>
					<table className='options__table'>
						<tbody>
							<tr>
								<td>
									{foodListRadioButton}
								</td>
								<td>
									{foodListLabel}
								</td>
							</tr>
							<tr className='options__spacer'>
							</tr>
							<tr>
								<td>
									{nutritionPercentagesRadioButton}
								</td>
								<td>
									{nutritionPercentagesLabel}
								</td>
							</tr>
							<tr className='options__spacer'>
							</tr>
							<tr>
								<td>
									{nutritionValuesRadioButton}
								</td>
								<td>
									{nutritionValuesLabel}
								</td>
							</tr>
						</tbody>
					</table>
					<button
						className='options__menu-remove-item'
						onClick={this.remove}
						>{this.state.removeButtonText}
					</button>
				</div>
			</div>
		)
    }

}

export default FoodInfoOptions