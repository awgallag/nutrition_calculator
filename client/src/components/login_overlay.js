// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import LoginPage from './login_page'

// Import css classes.
import "./../styles/overlay.css"

/*
	The LoginOverlay component provides an overlay for the login page. 
	
	props:
	hideOverlay - Function that tells the parent component to close the
		overlay.
*/
class LoginOverlay extends Component {
	
	constructor(props) {
		super(props)

		this.toggleOverlay = this.toggleOverlay.bind(this)
		
		this.state = {
			overlayStyle: 'overlay__display-login'
		}
	}
	
	toggleOverlay(){
		let newOverlay = 'overlay__display-login'
		
		if (this.state.overlayStyle === newOverlay){
			newOverlay = 'overlay__display-signup'
		}
		
		this.setState({
			overlayStyle: newOverlay
		})
	}

	render() {
        return (
            <div className='overlay--on'>
				<div className={this.state.overlayStyle}>
					<button
						className="overlay__close-button"
						title="close"
						onClick={this.props.hideOverlay}
						>x
					</button>
					<br />
					<LoginPage
						overlay={true}
						hideOverlay={this.props.hideOverlay}
						toggleOverlay={this.toggleOverlay}
					/>
				</div>
            </div>
        )
    }
}

export default LoginOverlay