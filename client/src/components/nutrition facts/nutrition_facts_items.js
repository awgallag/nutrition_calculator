// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import NutritionFactsOverlay from './nutrition_facts_overlay'

// Import data.
import nutrientInfo from './../../data/nutrient_info'
import fruitList from './../../data/fruit_list'
import vegetableList from './../../data/vegetable_list'
import nutList from './../../data/nut_list'
import dairyList from './../../data/dairy_list'
import grainList from './../../data/grain_list'
import meatAndEggList from './../../data/meat_and_egg_list'

// Import css classes.
import './../../styles/food_list.css'
import './../../styles/overlay.css'

let foodImages = new Map()

foodImages['fruits'] = fruitList
foodImages['vegetables'] = vegetableList
foodImages['nuts'] = nutList
foodImages['dairy'] = dairyList
foodImages['grains'] = grainList
foodImages['meatsandeggs'] = meatAndEggList

/* The NutritionFactsItems component displays a list of food items in either
	text or image format based on the view prop value. The list of food items
	is filtered by food category and sorted by name or nutrient based on the
	filter and sort props respectively. */
class NutritionFactsItems extends Component {

	constructor(props) {
		super(props)
		
		this.showOverlay = this.showOverlay.bind(this)
		this.hideOverlay = this.hideOverlay.bind(this)
		
		this.state = {
			overlay: false,
			currentItem: ''
		}
	}
	
	showOverlay(event) {
		this.setState({
			overlay: true,
			currentItem: event.target.title
		})
	}
	
	hideOverlay() {
		this.setState({
			overlay: false
		})
	}
	
	/* The getFilteredTextList method returns a list of text buttons, one for
		each of the food items that passes through the filter determined by the
		filter prop value. */
	getFilteredTextList() {
		let items = []
		let foodType = this.props.filter
		
		if (this.props.filter === 'all'){
			for (const [, category] of Object.entries(foodImages)){
				for (const [item] of Object.entries(category)){
					items.push(
						<button
							key={item}
							title={item}
							className='food-list--text__item'
							onClick={this.showOverlay}
							>{item}
						</button>
					)
				}
			}
		} else {
			for (const [item] of Object.entries(foodImages[foodType])){
				items.push(
					<button
						key={item}
						title={item}
						className='food-list--text__item'
						onClick={this.showOverlay}
						>{item}
					</button>
				)
			}
		}
		
		return items
	}
	
	/* The getFilteredImageList method returns a list of images, one for each
		of the food items that passes through the filter determined by the
		filter prop value. */
	getFilteredImageList() {
		let items = []
		let foodType = this.props.filter
		
		if (this.props.filter === 'all'){
			for (const [, category] of Object.entries(foodImages)){
				for (const [item, image] of Object.entries(category)){
					items.push(
						<img
							title={item}
							alt={item}
							src={image}
							key={item}
							className='food-list--images__item'
							onClick={this.showOverlay}
						/>)
				}
			}
		} else {
			for (const [item, image] of Object.entries(foodImages[foodType])){
				items.push(
					<img
						title={item}
						alt={item}
						src={image}
						key={item}
						className='food-list--images__item'
						onClick={this.showOverlay}
					/>)
			}
		}

		return items
	}
	
	/* The sortFilteredList method accepts a list of food images or text
		buttons as an argument and returns the list sorted either
		alphabetically or by the nutrient defined by the sort prop. */
	sortFilteredList(items){
		let nutrient = this.props.sort
		
		if (this.props.sort === 'name') {
			items.sort((a, b) => {
				if (a.key > b.key) {
					return 1
				}
				if (a.key < b.key) {
					return -1
				}
				return 0
			})
		} else {
			items.sort((a, b) => {
				if (nutrientInfo[a.key][nutrient] >
					nutrientInfo[b.key][nutrient])
				{
					return -1
				}
				if (nutrientInfo[a.key][nutrient] <
					nutrientInfo[b.key][nutrient])
				{
					return 1
				}
				return 0
			})
		}

		return items
	}

	render() {
		
		let items = []
		let viewClass
		
		if (this.props.view === 'images') {
			viewClass = 'food-list--images__container'
			items = this.getFilteredImageList()
		} else {
			viewClass = 'food-list--text__container'
			items = this.getFilteredTextList()
		}
		
		items = this.sortFilteredList(items)
		
        return (
			<>
				<div className={viewClass}>
					{items}
				</div>
				{ this.state.overlay ?
					<NutritionFactsOverlay
						hideOverlay={this.hideOverlay} 
						currentItem={this.state.currentItem}
					/>
				:
					null
				}
			</>
        )
    }
}

export default NutritionFactsItems