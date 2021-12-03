// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'
import EditUsername from './edit_username'
import EditAccountInformation from './edit_account_information'
import EditPassword from './edit_password'
import DeleteAccount from './delete_account'

// Import css classes.
import './../../styles/menu.css'
import './../../styles/message.css'

/* The EditAccount component provides options for a user to edit their account,
	enabling a user to delete their account or to change their: username, date
	of birth, sex, or password. */
class EditAccount extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.toggle = this.toggle.bind(this)
		
		this.state = {
			displayUsername: false,
			displayAccountInformation: false,
			displayChangePassword: false,
			displayDeleteAccount: false,
			usernameRef: React.createRef(),
			accountInformationRef: React.createRef(),
			changePasswordRef: React.createRef(),
			deleteAccountRef: React.createRef()
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
	
	// Checks if the client is logged into a user account.
	componentDidMount(){
		this.context.confirmAuth()
	}
	
	render() {
		if (this.context.authorized){
			return (
				<div className='menu__container'>
					<br />
					<div ref={this.state.usernameRef}>
						<button
							name='displayUsername'
							className='menu__option'
							onClick={this.toggle}
							>Change Username
						</button>
						{ this.state.displayUsername ?
							<div className='menu__section'>
								<EditUsername />
							</div>
						:
							null
						}
					</div>
					<div ref={this.state.accountInformationRef}>
						<button
							name='displayAccountInformation'
							className='menu__option'
							onClick={this.toggle}
							>Change Account Information
						</button>
						{ this.state.displayAccountInformation ?
							<div className='menu__section'>
								<EditAccountInformation />
							</div>
						:
							null
						}
					</div>
					<div ref={this.state.changePasswordRef}>
						<button
							name='displayChangePassword'
							className='menu__option'
							onClick={this.toggle}
							>Change Password
						</button>
						{ this.state.displayChangePassword ?
							<div className='menu__section'>
								<EditPassword />
							</div>
						:
							null
						}
					</div>
					<div ref={this.state.deleteAccountRef}>
						<button
							name='displayDeleteAccount'
							className='menu__option'
							onClick={this.toggle}
							>Delete Account
						</button>
						{ this.state.displayDeleteAccount ?
							<div className='menu__section'>
								<DeleteAccount />
							</div>
						:
							null
						}
					</div>
				</div>
			)
		} else {
			return (
				<>
					<p className='message--login'>
						Log-in to view your account page.
					</p>
				</>
			)
		}
    }
}

export default EditAccount