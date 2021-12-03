// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import NutritionFactsItems from './nutrition_facts_items'

// Import css classes.
import './../../styles/user_input.css'

/* The NutritionFacts component provides options for: viewing, filtering, and
	sorting the list of food items on the nutrition calculator webapp. */
class NutritionFacts extends Component {
	
	constructor(props){
		super(props)
		
		this.handleViewChange = this.handleViewChange.bind(this)
		this.handleFilterChange = this.handleFilterChange.bind(this)
		this.handleSortChange = this.handleSortChange.bind(this)
		
		this.state = {
			view: 'images',
			filter: 'all',
			sort: 'name'
		}
	}
	
	handleViewChange(e) {
		this.setState({
			view: e.target.value
		})
	}
	
	handleFilterChange(e) {
		this.setState({
			filter: e.target.value
		})	
	}
	
	handleSortChange(e) {
		this.setState({
			sort: e.target.value
		})
	}
	
	render() {
		let viewOptions =
			<select
				className='user-input__input-box'
				value={this.state.view}
				onChange={this.handleViewChange}>
				<option value="images">images</option>
				<option value="text">text</option>
			</select>
			
		let filterOptions =
			<select
				className='user-input__input-box'
				value={this.state.filter}
				onChange={this.handleFilterChange}>
				<option value="all">all</option>
				<option value="fruits">fruits</option>
				<option value="nuts">nuts</option>
				<option value="vegetables">vegetables</option>
				<option value="meatsandeggs">meats and eggs</option>
				<option value="grains">grains</option>
				<option value="dairy">dairy</option>
			</select>
		
		let sortOptions =
			<select
				className='user-input__input-box'
				value={this.state.sort}
				onChange={this.handleSortChange}>
				<option value="name">name</option>
				<option disabled>macro nutrients</option>
				<option value="calories">calories</option>
				<option value="protein">protein</option>
				<option value="fat">fat</option>
				<option value="carbohydrates">carbohydrates</option>
				<option value="fiber">fiber</option>
				<option disabled>vitamins</option>
				<option value="a">a</option>
				<option value="b1">b1 (thiamin)</option>
				<option value="b2">b2 (riboflavin)</option>
				<option value="b3">b3 (niacin)</option>
				<option value="b5">b5 (pantothenate)</option>
				<option value="b6">b6 (pyridoxine)</option>	
				<option value="b9">b9 (folate)</option>
				<option value="b12">b12 (cobalamin)</option>
				<option value="c">c</option>
				<option value="choline">choline</option>
				<option value="d">d</option>
				<option value="e">e</option>
				<option value="k">k</option>
				<option disabled>minerals</option>
				<option value="calcium">calcium</option>
				<option value="copper">copper</option>
				<option value="iron">iron</option>
				<option value="magnesium">magnesium</option>
				<option value="maganese">maganese</option>
				<option value="phosphorus">phosphorus</option>
				<option value="selenium">selenium</option>
				<option value="zinc">zinc</option>
				<option value="potassium">potassium</option>
				<option value="sodium">sodium</option>
			</select>

        return (
			<>
				<form>
					<table className='user-input__table'>
						<tbody>
							<tr>
								<td>
									<label>View</label>
								</td>
								<td>
									{viewOptions}
								</td>
							</tr>
							<tr>
								<td>
									<label>Filter</label>
								</td>
								<td>
									{filterOptions}
								</td>
							</tr>
							<tr>
								<td>
									<label>Sort by</label>
								</td>
								<td>
									{sortOptions}
								</td>
							</tr>
						</tbody>
					</table>
				</form>
				<NutritionFactsItems
					view={this.state.view} 
					filter={this.state.filter}
					sort={this.state.sort}
				/>
			</>
        )
    }
}

export default NutritionFacts