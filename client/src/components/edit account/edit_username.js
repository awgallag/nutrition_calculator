// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'

// Import css classes.
import './../../styles/message.css'
import './../../styles/user_input.css'

/* The EditUsername component provides an interface for a client logged into a
	user account to edit the user's username. */
class EditUsername extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.updateUsername = this.updateUsername.bind(this)
		this.onChangeNewUsername = this.onChangeNewUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		
		this.state = {
			newUsername: '',
			password: '',
			message: '',
			messageStyle: '',
			locked: false
		}
	}
	
	updateUsername(e){
		e.preventDefault()
		
		this.setState({
			locked: true
		},() => {
			this.context.updateUsername(this.state.newUsername,
				this.state.password)
		})
	}
	
	onChangeNewUsername(e){
		this.setState({
			newUsername: e.target.value
		})
	}
	
	onChangePassword(e){
		this.setState({
			password: e.target.value
		})
	}
	
	/* The componentDidUpdate method tells the component to display an error
		message if there was an error when attempting to update the user
		account in the database, or displays a confirmation message if the
		update was successful. */
	componentDidUpdate(){
		let error = this.context.error.editUsername
		let currentMessage = ''
		let currentStyle = ''
		
		if (error !== ''){
			if (error === 'none'){
				currentMessage = 'Account Information Updated'
				currentStyle = 'message--confirmation'			
			} else {
				currentMessage = 'Error: ' + error
				currentStyle = 'message--error'
			}
			
			this.setState({
				newUsername: '',
				password: '',
				locked: false,
				message: currentMessage,
				messageStyle: currentStyle
			}, () => {
				this.context.acknowledgeError('editUsername')
			})
		}
	}
	
	render() {
		if (this.state.locked){
			return (
				<p className='message--loading'>
					Updating user account...
				</p>
			)
		} else {
			return (
				<form onSubmit={this.updateUsername}>
					<table className='user-input__table--centered'>
						<tbody>
							<tr>
								<td>
									<label>New Username</label>
								</td>
								<td>
									<input
										className='user-input__input-box'
										type="text"
										value={this.state.newUsername}
										onChange={this.onChangeNewUsername}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label>Password</label>
								</td>
								<td>
									<input
										className='user-input__input-box'
										type="password"
										value={this.state.password}
										onChange={this.onChangePassword}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan='2'>
									<input
										type="submit"
										value="update account"
									/>
								</td>
							</tr>
							{ this.state.message !== '' ?
								<tr>
									<td colSpan='2'>
										<p className={this.state.messageStyle}>
											{this.state.message}
										</p>
									</td>
								</tr>
							:
								null
							}
						</tbody>
					</table>
				</form>
			)
		}
    }
}

export default EditUsername