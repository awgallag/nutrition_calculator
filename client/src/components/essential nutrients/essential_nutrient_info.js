// Import npm packages.
import React, { Component } from 'react'

// Import data.
import data from './../../data/essential_nutrient_info'

// Import css classes.
import './../../styles/nutrition_table.css'

/* The EssentialNutrientInfo component displays the Recommended Dietary
	Allowance (RDA) values for every essential nutrient based on the age and
	sex props passed down from the EssentialNutrient component. */
class EssentialNutrientInfo extends Component {
	
	constructor(props) {
        super(props)
		
		this.setTableValues = this.setTableValues.bind(this)
		
		this.state = {
			headerText: '',
			macroRows: [],
			vitaminRows: [],
			mineralRows: []
		}
	}
	
	/* The setTableValues method sets the: headerText, macroRows, vitaminRows,
		and mineralRows for the EssentialNutrientInfo tables. */
	setTableValues(){
		let type = this.getType()
		let currentHeaderText = this.getHeaderText()
		let currentMacroRows = this.getMacroRows(type)
		let currentVitaminRows
		let currentMineralRows
		let vitaminNames = ['A','B1 (Thiamin)','B2 (Riboflavin)','B3 (Niacin)',
			'B5 (Pantothenate)','B6 (Pyridoxine)','B7 (Biotin)','B9 (Folate)',
			'B12 (Cobalamin)','C','Choline','D','E','K']
		let vitaminUnits = ['μg','mg','mg','mg','mg*','mg','μg*','μg','μg',
			'mg','mg*','μg','mg','μg*']
		let mineralNames = ['Calcium','Chromium','Copper','Fluoride','Iodine',
			'Iron','Magnesium','Maganese','Molybdenum','Phosphorus','Selenium',
			'Zinc','Potassium','Sodium','Chloride']
		let mineralUnits = ['mg','μg*','μg','mg*','μg','mg','mg','mg*','μg',
			'mg','μg','mg','mg*','mg*','mg*']
		
		currentVitaminRows = this.getMicroRows(type, vitaminNames,
			vitaminUnits)
		currentMineralRows = this.getMicroRows(type, mineralNames,
			mineralUnits)
		
		this.setState({
			headerText: currentHeaderText,
			macroRows: currentMacroRows,
			vitaminRows: currentVitaminRows,
			mineralRows: currentMineralRows
		})
	}

	/* The getType method returns the essential nutrient category (type)
		determined by the age and sex props. */
	getType(){
		let type
		
		// Essential nutrients are the same for both sexes under the age of 9.
		if ((this.props.age === '0-6') || (this.props.age === '6-12') ||
			(this.props.age === '1-3') || (this.props.age === '4-8'))
		{
			type = this.props.age
		}
		else
		{
			type = this.props.sex + this.props.age
		}
		
		return type
	}
	
	/* The getHeaderText method returns a header message that states the type
		of person that the proceeding essential nutrient information is for. */
	getHeaderText(){
		let age
		let ageUnit
		let sex
		let headerText
		
		// Fixes age error in data (the data from NIH.gov had a typo)
		if (this.props.age === '6-12'){
			age = '7-12'
		} else {
			age = this.props.age
		}
		
		if (this.props.age === '0-6' || this.props.age === '6-12'){
			ageUnit = 'Month'
		} else {
			ageUnit = 'Year'
		}
		
		if (this.props.sex === 'M'){
			sex = 'Male'
		} else {
			sex = 'Female'
		}
		
		headerText = 'Essential Nutrients for a ' + age + ' ' + ageUnit +
			' Old ' + sex
		
		return headerText
	}
	
	/* The getMacroRows method takes an essential nutrient category (type) and
		returns a list of table rows to display the macro nutrient RDA values
		for the given category. */
	getMacroRows(type){
		let macroRows = []
		let macroRow
		let macroNames = ['Protein','Fat','Carbohydrates','Fiber']
		let macro = ''
		let unit = 'g'
		
		for (let i=0; i<macroNames.length; i++){
			macro = macroNames[i].toLowerCase()
			macroRow =
				<tr key={macroNames[i]}>
					<td className='nutrition-table__td'>
						{macroNames[i]}
					</td>
					{ data[type][macro] === -1 ?
						<td
							className='nutrition-table__td'
							title='No Data'
							>ND
						</td>
					:
						<td className='nutrition-table__td'>
							{data[type][macro]}
						</td>
					}
					<td className='nutrition-table__td'>
						{unit}
					</td>
				</tr>
			macroRows.push(macroRow)
		}

		return macroRows
	}
	
	/* The getMicroRows method takes a list of micro nutrients with their
		corrosponding units and an essential nutrient category (type) and
		returns a list of table rows to display the micro nutrient RDA values
		for the given category. */
	getMicroRows(type, microNames, units){
		let microRows = []
		let microRow
		let micro = ''
		let unit = ''
		
		for (let i=0; i<microNames.length; i++){
			micro = microNames[i].split(' ')[0].toLowerCase()
			unit = units[i]
			microRow =
				<tr key={microNames[i]}>
					<td className='nutrition-table__td'>
						{microNames[i]}
					</td>
					<td className='nutrition-table__td'>
						{data[type][micro]}
					</td>
					<td className='nutrition-table__td'>
						{unit}
					</td>
				</tr>
			microRows.push(microRow)
		}

		return microRows
	}
	
	componentDidMount(){
		this.setTableValues()
	}

	render() {
		
		return(
			<>
				<p className='nutrition-table__header'>
					{this.state.headerText}
				</p>
				{/* Macro Nutrients Table */}
				<p className='nutrition-table__header'>Macro Nutrients</p>
				<table className='nutrition-table'>
					<thead>
						<tr>
							<th className='nutrition-table__th'>Nutrient</th>
							<th className='nutrition-table__th'>RDA</th>
							<th className='nutrition-table__th'>Unit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.macroRows}
					</tbody>
				</table>
				{/* Vitamin Table */}
				<p className='nutrition-table__header'>Vitamins</p>
				<table className='nutrition-table'>
					<thead>
						<tr>
							<th className='nutrition-table__th'>Vitamin</th>
							<th className='nutrition-table__th'>RDA</th>
							<th className='nutrition-table__th'>Unit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.vitaminRows}
					</tbody>
				</table>
				{/* Mineral Table */}
				<p className='nutrition-table__header'>Minerals</p>
				<table className='nutrition-table'>
					<thead>
						<tr>
							<th className='nutrition-table__th'>Mineral</th>
							<th className='nutrition-table__th'>RDA</th>
							<th className='nutrition-table__th'>Unit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.mineralRows}
					</tbody>
				</table>
				<br />
			</>
		)
    }
}

export default EssentialNutrientInfo