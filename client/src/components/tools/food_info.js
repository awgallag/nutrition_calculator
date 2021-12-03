// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import FoodList from './food_list'
import NutritionList from './nutrition_list'
import FoodInfoOptions from './food_info_options'

/* The FoodInfo component displays the: food list, nutrition values, or
	nutrition percentages for a meal or food object depending on the display
	selected by the user, and the props passed down to the component. */
class FoodInfo extends Component {
	
	constructor(props) {
        super(props)
		
		this.setDisplay = this.setDisplay.bind(this)
		
		this.state = {
			display: 'Food List'
		}
	}
	
	setDisplay(currentDisplay){
		this.setState({
			display: currentDisplay
		},
		() => {
			this.props.scroll(this.props.index)
		})
	}
	
	render() {
		return (
			<>
				<FoodInfoOptions
					recordType={this.props.recordType} 
					index={this.props.index}
					remove={this.props.remove}
					setDisplay={this.setDisplay}
				/>
				{ this.state.display === 'Food List' ?
					<>
						<br />
						<br />
						<br />
						<FoodList 
							recordType={this.props.recordType}
							index={this.props.index}
							remove={this.props.remove}
							addSpacers={true}
						/>
					</>
				:
					null
				}
				{ this.state.display === 'Nutrition Values' ?
					<>
						<br />
						<NutritionList
							recordType={this.props.recordType}
							index={this.props.index}
							display={this.state.display}
						/>
					</>
				:
					null
				}
				{ this.state.display === 'Nutrition Percentages' ?
					<>
						<br />
						<NutritionList
							recordType={this.props.recordType}
							index={this.props.index}
							display={this.state.display}
						/>
					</>
				:
					null
				}
				<br />
			</>
		)
    }
}

export default FoodInfo