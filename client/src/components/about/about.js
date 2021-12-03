// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import OpenFeatures from './open_features'
import UserFeatures from './user_features'
import Glossary from './glossary'

// Import css classes.
import './../../styles/menu.css'

/* The About component renders information about the nutrition calculator
	including: a summary of the webapp, open features, user features, a
	glossary, and the sources of the nutrition information. */
class About extends Component {
	
	constructor(props) {
		super(props)

		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayAbout: false,
			displayOpenFeatures: false,
			displayUserFeatures: false,
			displayGlossary: false,
			displaySources: false,
			aboutRef: React.createRef(),
			openFeaturesRef: React.createRef(),
			userFeaturesRef: React.createRef(),
			glossaryRef: React.createRef(),
			sourcesRef: React.createRef()
		}
	}

	/* The toggle method toggles a section open/closed when it is called by
		a button associated with the section. */
	toggle(e){
		e.preventDefault()
		let display = true
		let currentDisplay = e.target.name
		let currentRef = e.target.name.charAt(7).toLowerCase() +
			e.target.name.substring(8) + "Ref"
		
		// Closes section if it was open when toggle was called.
		if (this.state[currentDisplay]){
			display = false
		}
		
		// Scrolls section into view if it was closed when toggle was called.
		if (display){
			window.requestAnimationFrame(()=>{
				this.state[currentRef].current.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			})
		}
		
		this.setState({
			[currentDisplay]: display
		})
	}
	
	render() {
        return (
			<div className='menu__container'>
				<br />
				<div ref={this.state.aboutRef}>
					<button
						name='displayAbout'
						className='menu__option'
						onClick={this.toggle}
						>About
					</button>
					{ this.state.displayAbout ?
						<div className='menu__section'>
							<p className='menu__section-text'>
								Nutrition Calculator is a webapp that makes it
								easier to keep track of your nutrient intake.
								The app currently contains ninety-eight food
								items that you can: sort by nutrient values,
								add together to make meals, or use for
								recording what you have eaten throughout the
								day.
							</p>
						</div>
					:
						null
					}
				</div>
				<div ref={this.state.openFeaturesRef}>
					<button
						name='displayOpenFeatures'
						className='menu__option'
						onClick={this.toggle}
						>Open Features
					</button>
					{ this.state.displayOpenFeatures ?
						<div className='menu__section'>
							<OpenFeatures />
						</div>
					:
						null
					}
				</div>
				<div ref={this.state.userFeaturesRef}>
					<button
						name='displayUserFeatures'
						className='menu__option'
						onClick={this.toggle}
						>User Features
					</button>
					{ this.state.displayUserFeatures ?
						<div className='menu__section'>
							<UserFeatures />
						</div>
					:
						null
					}
				</div>
				<div ref={this.state.glossaryRef}>
					<button
						name='displayGlossary'
						className='menu__option'
						onClick={this.toggle}
						>Glossary
					</button>
					{ this.state.displayGlossary ?
						<div className='menu__section'>
							<Glossary />
						</div>
					:
						null
					}
				</div>
				<div ref={this.state.sourcesRef}>
					<button
						name='displaySources'
						className='menu__option'
						onClick={this.toggle}
						>Sources
					</button>
					{ this.state.displaySources ?
						<div className='menu__section'>
							<p className='menu__section-text'>
								All of the nutrition information on this webapp
								came from the United States Department of
								Agriculture (USDA) and the National Institutes
								of Health (NIH).
							</p>
						</div>
					:
						null
					}
				</div>
			</div>
        )
    }
}

export default About