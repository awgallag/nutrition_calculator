// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'

// Import data.
import nutrientInfo from './../../data/nutrient_info'
import nutrientRDA from './../../data/essential_nutrient_info'

// Import css classes.
import './../../styles/nutrition_table.css'
import './../../styles/menu.css'

const nutrientList = ["calories","protein","fat","carbohydrates","fiber","a",
	"b1","b2","b3","b5","b6","b9","b12","c","choline","d","e","k","calcium",
	"copper","iron","magnesium","maganese","phosphorus","selenium","zinc",
	"potassium","sodium"]
	
const nutrientLabels = ["Calories","Protein","Fat","Carbohydrates","Fiber","A",
	"B1 (Thiamin)","B2 (Riboflavin)","B3 (Niacin)","B5 (Pantothenate)",
	"B6 (Pyridoxine)","B9 (Folate)","B12 (Cobalamin)","C","Choline","D","E",
	"K","Calcium","Copper","Iron","Magnesium","Maganese","Phosphorus",
	"Selenium","Zinc","Potassium","Sodium"]
	
const nutrientUnits = ["kcal","g","g","g","g","µg","mg","mg","mg","mg","mg",
	"µg","µg","mg","mg","µg","mg","µg","mg","mg","mg","mg","mg","mg","µg","mg",
	"mg","mg"]

// Indexes used to split table row lists by nutrients.
const FIRST_MACRO = 1
const FIRST_VITAMIN = 5
const FIRST_MINERAL = 18
const COPPER_INDEX = 19
const FAT_RECOMMENDATION = 44
const FAT_INDEX = 2

/*
	The NutritionList component displays either the total nutrient values or
	the nutrient percentages for a food record or a meal.
	
	props:
	index - The index location of the food record or meal in the user context
		foodRecords or meals list.
	recordType - 'meal' indicates the record index is for a meal, otherwise the
		record is assumed to be a food record.
	display - Either 'Nutrition Values' or 'Nutrition Percentages' indicates
		that NutritionList should display the nutrition totals or percentages,
		respectively.
*/
class NutritionList extends Component {
	static contextType = AccountContext
	
	constructor(props) {
        super(props)
		
		this.setNutritionValues = this.setNutritionValues.bind(this)
		this.toggleDisplay = this.toggleDisplay.bind(this)
		
		this.state = {
			energyPercentage: [],
			macroPercentages: [],
			vitaminPercentages: [],
			mineralPercentages: [],
			energyTotal: [],
			macroTotals: [],
			vitaminTotals: [],
			mineralTotals: [],
			recordLength: 0,
			percentageDisplay: false,
			displayProvided: false
		}
	}
	
	toggleDisplay(){
		let display = true
		if (this.state.percentageDisplay){
			display = false
		}
		
		this.setState({
			percentageDisplay: display
		})
	}
	
	/* The setNutritionValues method creates a table row for every nutrient
		value and percentage. */
	setNutritionValues(){
		let currentNutrition = this.getNutritionValues()
		let currentTitleList = new Array(nutrientList.length).fill(0)
		let currentWidthList = new Array(nutrientList.length).fill(0)
		let currentTotals = []
		let currentPercentages = []
		let currentRDA = 0
		/* Variable used to determine if the nutrition values need to be
			updated the next time componentDidUpdate is called. */
		let currentRecordLength = 0
		
		if (this.props.recordType === 'meal'){
			currentRecordLength =
				this.context.meals[this.props.index].foodObjects.length
		} else {
			currentRecordLength =
				this.context.foodRecords[this.props.index].record.length
		}
		
		/* Calculates the percentage of a user's nutrient RDAs that have been
			fulfilled based on the food they consumed for the current
			record. */
		currentTitleList[0] = currentNutrition[0].toString() + ' / 2000'
		currentWidthList[0] = ((currentNutrition[0]/2000)*100).toString()+'%'
		
		for(let i=1;i<nutrientList.length;i++){
			if (i === COPPER_INDEX){
				/* Copper RDA is in µg while copper nutrients are in mg. This 
					converts the Copper RDA to mg. */
				currentRDA =
					nutrientRDA[this.context.nutritionGroup][nutrientList[i]] /
					1000
			} else if (i === FAT_INDEX &&
				nutrientRDA[this.context.nutritionGroup][nutrientList[i]] ===
				-1)
			{
				/* If there is no RDA for fat, then use the minimum of the
					acceptable distribution range of fat for adults.*/
				currentRDA = FAT_RECOMMENDATION
			} else {
				currentRDA =
					nutrientRDA[this.context.nutritionGroup][nutrientList[i]]
			}
			
			currentTitleList[i] = currentNutrition[i].toString() + ' / ' +
				currentRDA
			currentWidthList[i] = ((currentNutrition[i] / currentRDA) *
				100).toString()+'%'
		}
		
		/* Creates a table row for each nutrient for both the totals and
			percentage displays. */
		for (let i=0;i<nutrientList.length;i++){
			currentTotals.push(
				<tr key={"total" + i}>
					<td className='nutrition-table__td'>
						{nutrientLabels[i]}
					</td>
					<td className='nutrition-table__td'>
						{currentNutrition[i]}
					</td>
					<td className='nutrition-table__td'>
						{nutrientUnits[i]}
					</td>
				</tr>
			)

			currentPercentages.push(
				<tr key={"percentage"+i}>
					<td className='nutrition-table__td--progress-bar-label'>
						{nutrientLabels[i]}
					</td>
					<td className='nutrition-table__td--progress-bar-container'
						title={currentTitleList[i]}>
						<div className='nutrition-table__progress-bar' 
							style={{'width':currentWidthList[i]}}>
						</div>
					</td>
				</tr>
			)
		}
		
		this.setState({
			energyPercentage: currentPercentages[0],
			macroPercentages: 
				currentPercentages.slice(FIRST_MACRO,FIRST_VITAMIN),
			vitaminPercentages: 
				currentPercentages.slice(FIRST_VITAMIN,FIRST_MINERAL),
			mineralPercentages: currentPercentages.slice(FIRST_MINERAL),
			energyTotal: currentTotals[0],
			macroTotals: currentTotals.slice(FIRST_MACRO,FIRST_VITAMIN),
			vitaminTotals: currentTotals.slice(FIRST_VITAMIN,FIRST_MINERAL),
			mineralTotals: currentTotals.slice(FIRST_MINERAL),
			recordLength: currentRecordLength
		})
	}
	
	/* The getNutritionValues method returns a list of the total nutrition
		values for the food record or meal provided by the parent component. */
	getNutritionValues(){
		let record = []
		let totalNutrition = new Array(nutrientList.length).fill(0)
		let currentFoodObjects = []
		let currentItem = ''
		
		if(this.props.recordType === 'meal'){
			record = this.context.meals[this.props.index].foodObjects
		} else {
			record =
				this.context.foodRecords[this.props.index].record
		}

		for (let i=0;i<record.length;i++){
			if (record[i].foodItem === undefined){
				currentFoodObjects = record[i].foodObjects
				/* Add nutrients from every foodObject in the currentMeal to
					totalNutrition. */
				for (let j=0;j<currentFoodObjects.length;j++){
					for (let k=0;k<nutrientList.length;k++){
						currentItem = currentFoodObjects[j].foodItem
						totalNutrition[k] += 
							nutrientInfo[currentItem][nutrientList[k]]*
							(currentFoodObjects[j].quantity/100)
					}
				}
			} else {
				// Add nutrients from current foodObject to totalNutrition.
				for (let j=0;j<nutrientList.length;j++){
					totalNutrition[j] += 
						nutrientInfo[record[i].foodItem][nutrientList[j]]*
						(record[i].quantity/100)
				}
			}
		}
		
		// Round off totalNutrition values to 3 decimal places.
		for(let i=0;i<nutrientList.length;i++){
			totalNutrition[i] = Number.parseFloat(totalNutrition[i]).toFixed(3)
		}
		
		return totalNutrition
	}
	
	/* The componentDidMount method initializes the NutritionList to display
		either nutrition totals or nutrition percentages based on the display
		prop sent by the parent component. */
	componentDidMount(){
		let currentPercentageDisplay
		let currentDisplayProvided = false
		
		if (this.props.display === 'Nutrition Values'){
			currentPercentageDisplay = false
			currentDisplayProvided = true			
		} else if (this.props.display === 'Nutrition Percentages'){
			currentPercentageDisplay = true
			currentDisplayProvided = true
		}

		this.setState({
			percentageDisplay: currentPercentageDisplay,
			displayProvided: currentDisplayProvided
		},
			this.setNutritionValues()
		)
	}

	/* The componentDidUpdate function updates the nutrition values if the food
		record or meal being displayed was changed by another part of the
		webapp. */
	componentDidUpdate(){
		let validRecord = true
		let currentLength = 0
		
		if (this.props.recordType === 'meal'){
			if(this.context.meals[this.props.index] === undefined){
				validRecord = false
			} else {
				currentLength =
					this.context.meals[this.props.index].foodObjects.length
			}				
		} else {
			if(this.context.foodRecords[this.props.index] === undefined){
				validRecord = false
			} else {
				currentLength = 
					this.context.foodRecords[this.props.index].record.length
			}
		}

		if (validRecord && (currentLength !== this.state.recordLength)){
			this.setNutritionValues()
		}
	}
	
	render() {
		let button = null
		
		if (this.state.displayProvided === false){
			button =
				<button
					onClick={this.toggleDisplay}
					className='menu__button'>
					{ this.state.percentageDisplay ?
						"totals"
					:
						"percentages"
					}
				</button>
		}
		
		return (
			<>
				{button}
				<br />
				<p className='nutrition-table__header'>Energy</p>
				<table className='nutrition-table'>
					<tbody>
						{ this.state.percentageDisplay ? 
							this.state.energyPercentage
						:
							this.state.energyTotal
						}
					</tbody>
				</table>
				<p className='nutrition-table__header'>Macro Nutrients</p>
				<table className='nutrition-table'>
					<tbody>
						{ this.state.percentageDisplay ? 
							this.state.macroPercentages
						:
							this.state.macroTotals
						}
					</tbody>
				</table>
				<p className='nutrition-table__header'>Vitamins</p>
				<table className='nutrition-table'>
					<tbody>
						{ this.state.percentageDisplay ? 
							this.state.vitaminPercentages
						:
							this.state.vitaminTotals
						}
					</tbody>
				</table>
				<p className='nutrition-table__header'>Minerals</p>
				<table className='nutrition-table'>
					<tbody>
						{ this.state.percentageDisplay ? 
							this.state.mineralPercentages
						:
							this.state.mineralTotals
						}
					</tbody>
				</table>
				<br />
			</>
		)
    }
}

export default NutritionList