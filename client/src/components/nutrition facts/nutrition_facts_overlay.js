// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import nutrientInfo from './../../data/nutrient_info'

// Import css classes.
import './../../styles/overlay.css'
import './../../styles/nutrition_table.css'

/* The NutrientFactsOverlay displays an overlay with the nutrient breakdown of
	a 100 gram quantity of the food item passed down as the currentItem
	prop. */
class NutritionFactsOverlay extends Component {
	scrollBoxRef = React.createRef()
	
	constructor(props){
		super(props)
		
		this.generateTableRows = this.generateTableRows.bind(this)
		
		this.state = {
			energyRows: [],
			macroRows: [],
			vitaminRows: [],
			mineralRows: []
		}
	}
	
	/* The generateTableRows method generates table rows that display the
		nutrient breakdown of the food item passed down as the currentItem
		prop. */
	generateTableRows(){
		let rows = []
		let nutrientNames = ['Calories','Protein','Fat','Carbohydrates',
			'Fiber','A','B1 (Thiamin)','B2 (Riboflavin)','B3 (Niacin)',
			'B5 (Pantothenate)','B6 (Pyridoxine)','B9 (Folate)',
			'B12 (Cobalamin)','C','Choline','D','E','K','Calcium','Copper',
			'Iron','Magnesium','Maganese','Phosphorus','Selenium','Zinc',
			'Potassium','Sodium']
		let nutrientUnits = ['kcal','g','g','g','g','µg','mg','mg','mg','mg',
			'mg','µg','µg','mg','mg','µg','mg','µg','mg','mg','mg','mg','mg',
			'mg','µg','mg','mg','mg']
		let nutrient = ''
		
		for (let i=0; i<nutrientNames.length; i++){
			nutrient = nutrientNames[i].split(' ')[0].toLowerCase()
			rows.push(
				<tr key={nutrient}>
					<td className='nutrition-table__td'>
						{nutrientNames[i]}
					</td>
					<td className='nutrition-table__td'>
						{nutrientInfo[this.props.currentItem][nutrient]}
					</td>
					<td className='nutrition-table__td'>
						{nutrientUnits[i]}
					</td>
				</tr>
			)
		}
		
		this.setState({
			energyRows: rows.slice(0,1),
			macroRows: rows.slice(1,5),
			vitaminRows: rows.slice(5,18),
			mineralRows: rows.slice(18)
		})
	}
	
	componentDidMount(){
		this.generateTableRows()
	}

	render() {
        return (
			<div className='overlay--on'>
				<div className='overlay__display'>
					<div className="overlay__header-container">
							<button
								className="overlay__close-button"
								title="close"
								onClick={this.props.hideOverlay}
								>x
							</button>
							<p className='overlay__header'>
								{this.props.currentItem}
							</p>
					</div>
					<div
						className="overlay__scrollbox"
						ref={this.scrollBoxRef}>
						<p className='nutrition-table__header'>Energy</p>
						<table className='nutrition-table'>
							<tbody>
								{this.state.energyRows}
							</tbody>
						</table>
						<p className='nutrition-table__header'>
							Macro Nutrients
						</p>
						<table className='nutrition-table'>
							<tbody>
								{this.state.macroRows}
							</tbody>
						</table>
						<p className='nutrition-table__header'>Vitamins</p>
						<table className='nutrition-table'>
							<tbody>
								{this.state.vitaminRows}
							</tbody>
						</table>
						<p className='nutrition-table__header'>Minerals</p>
						<table className='nutrition-table'>
							<tbody>
								{this.state.mineralRows}
							</tbody>
						</table>
						<br />
					</div>
				</div>
			</div>
        )
    }
}

export default NutritionFactsOverlay