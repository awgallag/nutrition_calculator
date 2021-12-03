// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import EssentialNutrientInfo from './essential_nutrient_info'

// Import css classes.
import "./../../styles/user_input.css"

/* The EssentialNutrients component provides options to view the essential
	nutrient Reccomended Dietary Allowance (RDA) values for any age and sex
	combination. */
class EssentialNutrients extends Component {
	
	constructor(props){
		super(props)
		
		this.handleSexChange = this.handleSexChange.bind(this)
		this.handleAgeChange = this.handleAgeChange.bind(this)
		this.displayRDAValues = this.displayRDAValues.bind(this)
		this.displayOptions = this.displayOptions.bind(this)
		
		this.state = {
			age: '0-6',
			sex: 'M',
			displayRDAValues: false
		}
	}
	
	handleAgeChange(e) {
		this.setState({age: e.target.value})
	}
	
	handleSexChange(e) {
		this.setState({sex: e.target.value})
	}
	
	displayRDAValues(e) {
		e.preventDefault()

		this.setState({
			displayRDAValues: true
		})
	}
	
	displayOptions() {
		this.setState({
			displayRDAValues: false
		})
	}
	
	render() {
		let ageInput =
			<select
				className='user-input__input-box'
				value={this.state.age}
				onChange={this.handleAgeChange}>
				<option value="0-6">0-6 months</option>
				<option value="6-12">7-12 months</option>
				<option value="1-3">1-3 years</option>
				<option value="4-8">4-8 years</option>
				<option value="9-13">9-13 years</option>
				<option value="14-18">14-18 years</option>
				<option value="19-30">19-30 years</option>
				<option value="31-50">31-50 years</option>
				<option value="51-70">51-70 years</option>
				<option value=">70">> 70 years</option>
			</select>
			
		let sexInput =
			<select
				className='user-input__input-box'
				value={this.state.sex}
				onChange={this.handleSexChange}>
				<option value="M">Male</option>
				<option value="F">Female</option>
			</select>
		
		if (this.state.displayRDAValues){
			return (
				<>
					<button onClick={this.displayOptions}>
						Change Options
					</button>
					<EssentialNutrientInfo
						age={this.state.age}
						sex={this.state.sex}
					/>
				</>
			)
		} else {
			return (
				<form onSubmit={this.displayRDAValues}>
					<table className='user-input__table'>
						<tbody>
							<tr>
								<td>
									<label>Age</label>
								</td>
								<td>
									{ageInput}
								</td>
							</tr>
							<tr>
								<td>
									<label>Sex</label>
								</td>
								<td>
									{sexInput}
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colSpan='2'>
									<input
										type="submit"
										value="Get Nutrient Info"
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</form>
			)
		}
    }
}

export default EssentialNutrients