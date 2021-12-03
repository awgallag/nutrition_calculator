// Import npm packages.
import React, { Component } from 'react'

// Import data.
import foodList from './../../data/food_list'

// Import css classes.
import './../../styles/combo_box.css'

// Scroll Box Constants
const SB_ITEM_HEIGHT = 20
const SB_MAX_ITEMS = 5
const SB_TOP_OFFSET = 4

/* The ComboBox component is an input box that provides a list of options based
	on user input. The list of options is filtered so that only options that
	match the user input are revealed. If the user input does not match any of
	the available options then the user input becomes red indicating that the
	input is invalid. */
class ComboBox extends Component {
	
	constructor(props) {
		super(props)
		
		this.onKeyDown = this.onKeyDown.bind(this)
		this.onArrowUp = this.onArrowUp.bind(this)
		this.onArrowDown = this.onArrowDown.bind(this)
		this.filterOptions = this.filterOptions.bind(this)
		this.highlightOption = this.highlightOption.bind(this)
		this.selectHighlightedOption = this.selectHighlightedOption.bind(this)
		this.onMouseOverOption = this.onMouseOverOption.bind(this)

		this.state = {
			userInput: '',
			highlightedOption: {
				item: '',
				index: '0'
			},
			options: [],
			inputStyle: 'combo-box__input',
			scrollBoxStyle: 'combo-box__scroll-box--hidden',
			scrollBoxRef: React.createRef()
		}
	}

	/* The selectHighlightedOption method updates the userInput to the current
		highighted option and then sends that value to the parent component. */
	selectHighlightedOption(){
		this.setState({
			userInput: this.state.highlightedOption.item,
			scrollBoxStyle: 'combo-box__scroll-box--hidden'
		},() => {
			this.state.scrollBoxRef.current.scrollTo(0, 0)
			this.props.sendItem(this.state.userInput)
		})
	}
	
	/* The filterOptions method generates a list of all the combo-box options
		available given the current input. */
	filterOptions(e){
		let currentInput = e.target.value
		let currentList = foodList
		let currentOptions = []
		let currentInputStyle = 'combo-box__input--invalid'
		let currentScrollBoxStyle = 'combo-box__scroll-box--hidden'
		let highlightFirstOption = (currentInput !== '')
		let currentHighlightedOption = {
			item: '',
			index: '0'
		}

		// Filter options list.
		if (currentInput !== '') {
			currentList = this.filterList(currentInput, currentList)
		}
		
		// Create options list.
		for (let i=0; i<currentList.length; i++){
			currentOptions.push(
				<p
					id={i}
					key={currentList[i]}
					className={ i === 0 && highlightFirstOption ?
						'combo-box__scroll-box-item--selected'
					:
						'combo-box__scroll-box-item'
					}
					onMouseOver={this.onMouseOverOption}
					>{currentList[i]}
				</p>
			)
		}

		// Show options if options list is not empty.
		if (currentList.length !== 0){
			currentInputStyle = 'combo-box__input'
			
			// Highlight first option unless input is empty.
			if (highlightFirstOption)
				currentHighlightedOption.item = currentList[0]
			else
				currentHighlightedOption.item = ''
			
			if (currentList.length > 5){
				currentScrollBoxStyle = 'combo-box__scroll-box--overflow'
			}
			else {
				currentScrollBoxStyle = 'combo-box__scroll-box'
			}
		}
		
		this.setState({
			userInput: currentInput,
			highlightedOption: currentHighlightedOption,
			options: currentOptions,
			inputStyle: currentInputStyle,
			scrollBoxStyle: currentScrollBoxStyle
		}, () => {
			this.state.scrollBoxRef.current.scrollTo(0, 0)
		})
	}
	
	/* The filterList method accepts a filter item and a list as arguments and
		returns all of the items in the list that match the filter item. */
	filterList(item, list){
		let filteredList = []
		let filters = item.toUpperCase().split(' ')
		let currentStrings = []
		let currentString = ''
		let addItem = true
		let filterFound = false
		
		for (let i=0; i<list.length; i++){
			currentStrings = list[i].split(' ')
			addItem = true
			
			// Check if current list item matches the filter item.
			for (let j=0; j<filters.length; j++){
				filterFound = false
				
				// Check if there is a match for the current filter.
				for (let k=0; k<currentStrings.length; k++){
					currentString = currentStrings[k].slice(0,
						filters[j].length).toUpperCase()

					if (currentString === filters[j]){
						filterFound = true
						break
					}
				}
				
				if (filterFound === false){
					addItem = false
					break
				}
			}
			
			if (addItem){
				filteredList.push(list[i])
			}
		}
		
		return filteredList
	}
	
	/* The onMouseOverOption method highlights the option that the mouse is
		hovering over and scrolls the option completely into view if the option
		is overflowing out of the scrollbox view. */
	onMouseOverOption(e){
		e.preventDefault()
		let updatedOptions = []
		let topOfScrollBox = this.state.scrollBoxRef.current.scrollTop
		let offsetScrollBar =
			!(Number.isInteger(topOfScrollBox / SB_ITEM_HEIGHT))
		let optionIndex = parseInt(e.target.id)
		let position = 0
		let option = {
			item: e.target.innerHTML,
			index: e.target.id
		}
		
		/* If highlighting an option that is partially out of view then scroll
			the option fully into view. */
		if (offsetScrollBar){
			/* Fix offset when option is overflowing over top of the div. */
			position = SB_ITEM_HEIGHT*(optionIndex)
			
			if (position < topOfScrollBox){
				this.state.scrollBoxRef.current.scrollTo(0, position)
			}
			
			/* Fix offset when option is overflowing below bottom of div. */
			position = SB_ITEM_HEIGHT*(optionIndex-SB_TOP_OFFSET)
			
			if (position > topOfScrollBox){
				this.state.scrollBoxRef.current.scrollTo(0, position)
			}
		}
		
		// Highlight the option that the mouse is over.
		updatedOptions = this.highlightOption(option)
		
		this.setState({
			options: updatedOptions,
			highlightedOption: option
		})
	}
	
	/* The onKeyDown method selects the current highlighted option if the enter
		key is pressed, and scrolls to highlight the next option in the options
		list if the up or down arrow key is pressed. */
	onKeyDown(e){
		let numOptions = this.state.options.length
		let position = parseInt(this.state.highlightedOption.index)
		let topOfScrollBox = this.state.scrollBoxRef.current.scrollTop
		let offsetScrollBar =
			!(Number.isInteger(topOfScrollBox / SB_ITEM_HEIGHT))
		let nextOption = {
			item: '',
			position: ''
		}
		
		if (e.key === 'Enter'){
			this.selectHighlightedOption()
		} else if (e.key === 'ArrowDown'){
			this.onArrowDown(numOptions, position, nextOption, offsetScrollBar)
		} else if (e.key === 'ArrowUp'){
			this.onArrowUp(numOptions, position, nextOption, offsetScrollBar)
		}
	}
	
	/* The onArrowDown method highlights the next option south of the previous
		option when the down arrow key is pressed. (When the bottom of the list
		is reached the next option is the first option in the list.) */
	onArrowDown(numOptions, index, nextOption, offsetScrollBar){
		let updatedOptions = []
		let topOfScrollBox = this.state.scrollBoxRef.current.scrollTop
		let scrollRef = this.state.scrollBoxRef.current
		let position = 0
		
		/* When no option is highlighted adjusts index so that the down
			arrow will go to the first option in the list. */
		if (this.state.highlightedOption.item === '') {
			index = -1
		}

		/* If at the bottom of the list loop back to the top of the list,
			otherwise go to the next item in the list. */
		if (index === numOptions - 1){
			nextOption.item = this.state.options[0].key
			nextOption.index = '0'
			this.state.scrollBoxRef.current.scrollTo(0, 0)
		} else {
			nextOption.item = this.state.options[index+1].key
			nextOption.index = index + 1

			if (offsetScrollBar){
				/* Fix scrollbar offset when highlighting the last visible
					option in the scrollbox. */
				position = SB_ITEM_HEIGHT*(index-(SB_TOP_OFFSET-1))
				
				if (position > topOfScrollBox){
					scrollRef.scrollTo(0,position)
				}
			} else {
				// Scroll to the next option if at the bottom of the scrollbox.
				position = SB_ITEM_HEIGHT*(index-SB_TOP_OFFSET)
				
				if (position === topOfScrollBox){
					scrollRef.scrollBy(0,SB_ITEM_HEIGHT)
				}
			}
		}

		// Highlight the next option in the list of options.
		updatedOptions = this.highlightOption(nextOption)
		
		this.setState({
			options: updatedOptions,
			highlightedOption: nextOption
		})
	}
	
	/* The onArrowUp method highlights the next option north of the previous
		option when the up arrow key is pressed. (When the top of the list is
		reached the next option is the last option in the list.) */
	onArrowUp(numOptions, index, nextOption, offsetScrollBar){
		let updatedOptions = []
		let topOfScrollBox = this.state.scrollBoxRef.current.scrollTop
		let scrollRef = this.state.scrollBoxRef.current
		
		/* When no option is highlighted adjusts index so that 
			the up arrow will go to the last option in the list. */
		if (this.state.highlightedOption.item === '') {
			index = 0
		}

		/* If at the top of the list loop to the bottom of the list,
			otherwise go to the next option in the list. */
		if (index === 0){
			nextOption.item = this.state.options[numOptions-1].key
			nextOption.index = numOptions - 1
			scrollRef.scrollTo(0, SB_ITEM_HEIGHT*(numOptions-SB_MAX_ITEMS))
		} else {
			nextOption.item = this.state.options[index-1].key
			nextOption.index = index - 1

			if (offsetScrollBar){
				/* Fix scrollbar offset when highlighting the first visible
					option in the scrollbox. */
				if (SB_ITEM_HEIGHT*(index-1) < topOfScrollBox){
					scrollRef.scrollTo(0,SB_ITEM_HEIGHT*(index-1))
				}
			} else {
				// Scroll to the next option if at the top of the scrollbox.
				if (SB_ITEM_HEIGHT*(index) === topOfScrollBox){
					scrollRef.scrollBy(0,-SB_ITEM_HEIGHT)
				}
			}
		}
		
		// Highlight the next option in the list of options.
		updatedOptions = this.highlightOption(nextOption)
		
		this.setState({
			options: updatedOptions,
			highlightedOption: nextOption
		})
	}
	
	/* The highlightOption method removes highlights from any highlighted
		options in the options list, highlights the option sent as an
		argument, and returns the new list of options. */
	highlightOption(option){
		let options = this.state.options
		
		for (let i=0; i<options.length; i++) {
			options[i] =
				<p
					id={i}
					key={options[i].key}
					className={ i === parseInt(option.index) ?
						'combo-box__scroll-box-item--selected'
					:
						'combo-box__scroll-box-item'
					}
					onMouseOver={this.onMouseOverOption}
					>{options[i].key}
				</p>
		}

		return options
	}
	
	/* The componentDidUpdate method clears the combobox input when the
		clearInput prop is set to true by the parent component. */
	componentDidUpdate(){
		if (this.props.clearInput){
			this.setState({
				userInput: '',
				highlightedOption: {
					item: '',
					index: '0'
				},
				options: [],
				inputStyle: 'combo-box__input',
				scrollBoxStyle: 'combo-box__scroll-box--hidden'
			}, () => {
				this.props.inputCleared()
			})
		}
	}

	render() {
        return (
			<div className='combo-box__container'>
				<input
					className={this.state.inputStyle}
					onChange={this.filterOptions}
					onFocus={this.filterOptions}
					onBlur={this.selectHighlightedOption}
					onKeyDown={this.onKeyDown}
					value={this.state.userInput}
				/>
				<div
					ref={this.state.scrollBoxRef}
					className={this.state.scrollBoxStyle}
					>{this.state.options}
				</div>
			</div>
        )
    }
}

export default ComboBox