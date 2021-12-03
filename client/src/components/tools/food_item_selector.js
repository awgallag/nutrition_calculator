// Import npm packages.
import React, { Component } from 'react'

//Import react components.
import ComboBox from './combo_box'

// Import css classes.
import './../../styles/message.css'
import './../../styles/user_input.css'

/* The FoodItemSelector component accepts user input for a food item and a
	quantity, then sends the resulting food object to the parent component
	trough the sendvalue prop. (A date user input is also provided if
	the parent component provides date and updateDate props.) */
class FoodItemSelector extends Component {
	
	constructor(props) {
		super(props)
		
		this.onChangeDate = this.onChangeDate.bind(this)
		this.onChangeQuantity = this.onChangeQuantity.bind(this)
		this.sendFoodObject = this.sendFoodObject.bind(this)
		this.setFoodItem = this.setFoodItem.bind(this)
		this.inputCleared = this.inputCleared.bind(this)
		
		this.state = {
			foodItem: '',
			quantity: '',
			errorMessage: '',
			clearComboBoxInput: false
		}
	}
	
	inputCleared(){
		this.setState({
			clearComboBoxInput: false
		})
	}
	
	setFoodItem(item){
		this.setState({
			foodItem: item
		})
	}
	
	onChangeDate(e){
		e.preventDefault()
		this.setState({
			date: e.target.value
		})
	}
	
	/* The onChangeQuantity method ensures that the quanity has no more than 2
		decimal places. */
	onChangeQuantity(e){
		let regex = /^[0-9]*[.]{0,1}[0-9]{0,2}$/

		if( e.target.value === '' || regex.exec(e.target.value) !== null){
			this.setState({
				quantity: e.target.value
			})
		}
	}
	
	/* The sendFoodObject method sends the current state variables foodItem and
		quantity to FoodItemSelector's parent component. */
	sendFoodObject(){
		let zeroQuantity = (parseFloat(this.state.quantity) === 0)
		let emptyFoodItem = (this.state.foodItem === '')
		let emptyQuantity = (this.state.quantity === '')
		let invalidData = (zeroQuantity || emptyQuantity || emptyFoodItem)
		let currentErrorMessage = ''
		let currentFoodItem = this.state.foodItem
		let currentQuantity = this.state.quantity
		let clearComboBox = false
		
		// Only send foodItem and quantity if the data is valid.
		if (invalidData){
			if (emptyFoodItem && emptyQuantity){
				currentErrorMessage = 'Please select a Food Item and Quantity.'
			} else if (emptyFoodItem){
				currentErrorMessage = 'Please select a Food Item.'
			} else if (emptyQuantity){
				currentErrorMessage = 'Please select a Quantity.'
			} else if (zeroQuantity){
				currentErrorMessage = 'Quantity must be greater than 0.'
			}
		} else {
			this.props.sendValue(this.state.foodItem, this.state.quantity)
			currentFoodItem = ''
			currentQuantity = ''
			clearComboBox = true
		}
		
		this.setState({
			foodItem: currentFoodItem,
			quantity: currentQuantity,
			errorMessage: currentErrorMessage,
			clearComboBoxInput: clearComboBox
		})
	}

	render() {
        return (
			<table className='user-input__table--centered'>
				<tbody>
					<tr>
						<td>
							<label>Food Item</label>
						</td>
						<td>
							<ComboBox
								clearInput={this.state.clearComboBoxInput}
								inputCleared={this.inputCleared}
								sendItem={this.setFoodItem}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label>Quantity</label>
						</td>
						<td>
							<input
								type="text"
								className='user-input__input-box--large'
								value={this.state.quantity}
								onChange={this.onChangeQuantity}
							/>
						</td>
					</tr>
					{ this.props.date !== undefined ?
						<tr>
							<td>
								<label>Date</label>
							</td>
							<td>
								<input
									type="date"
									className='user-input__input-box--large'
									value={this.props.date}
									onChange={this.props.updateDate}
								/>
							</td>
						</tr>
					:
						null
					}
					<tr>
						<td colSpan='2'>
							<button onClick={this.sendFoodObject}>
								Add Item
							</button>
						</td>
					</tr>
					{ this.state.errorMessage !== '' ?
						<tr>
							<td colSpan='2'>
								<p className='message--error'>
									{this.state.errorMessage}
								</p>
							</td>
						</tr>
					:
						null
					}
				</tbody>
			</table>
        )
    }
}

export default FoodItemSelector