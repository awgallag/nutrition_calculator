// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'

// Import css classes.
import './../../styles/message.css'
import './../../styles/user_input.css'

/* The EditPassword component provides an interface for a client logged into a
	user account to change the user's password. */
class EditPassword extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.updatePassword = this.updatePassword.bind(this)
		this.onChangeNewPassword = this.onChangeNewPassword.bind(this)
		this.onChangeConfirmNewPassword = 
			this.onChangeConfirmNewPassword.bind(this)
		this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this)
		
		this.state = {
			newPassword: '',
			confirmNewPassword: '',
			currentPassword: '',
			message: '',
			messageStyle: '',
			locked: false
		}
	}

	onChangeNewPassword(e){
		this.setState({
			newPassword: e.target.value
		})
	}

	onChangeConfirmNewPassword(e){
		this.setState({
			confirmNewPassword: e.target.value
		})	
	}
	
	onChangeCurrentPassword(e){
		this.setState({
			currentPassword: e.target.value
		})	
	}
	
	/* The updatePassword method validates the user input password, and then
		updates the password for the user account that the client is logged
		into if it is a valid password. */
	updatePassword(e){
		e.preventDefault()
		let valid = true
		let errorMessage = ''
		
		// Checks if new password is a valid password.
		if (this.state.newPassword !== this.state.confirmNewPassword){
			valid = false
			errorMessage = 'Error: Passwords don\'t match'
		} else if (this.state.newPassword.length < 7){
			valid = false
			errorMessage = 
				'Error: Passwords must be at least 7 characters long.'
		}

		// Updates password if the new password is valid.
		if (valid){
			this.setState({
				locked: true
			}, () => {
				this.context.updatePassword(this.state.newPassword,
					this.state.currentPassword)
			})
		} else {
			this.setState({
				newPassword: '',
				confirmNewPassword: '',
				currentPassword: '',
				message: errorMessage,
				messageStyle: 'message--error'
			})	
		}
	}
	
	/* The componentDidUpdate method tells the component to display an error
		message if there was an error when attempting to update the user
		account in the database, or displays a confirmation message if the
		update was successful. */
	componentDidUpdate(){
		let error = this.context.error.editPassword
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
				newPassword: '',
				confirmNewPassword: '',
				currentPassword: '',
				locked: false,
				message: currentMessage,
				messageStyle: currentStyle
			}, () => {
				this.context.acknowledgeError('editPassword')
			})
		}
	}
	
	render() {
		let newPasswordInput =
			<input
				className='user-input__input-box'
				type="password"
				value={this.state.newPassword}
				onChange={this.onChangeNewPassword}
			/>
		
		let confirmPasswordInput =
			<input
				className='user-input__input-box'
				type="password"
				value={this.state.confirmNewPassword}
				onChange={this.onChangeConfirmNewPassword}
			/>
		
		let currentPasswordInput =
			<input
				className='user-input__input-box'
				type="password"
				value={this.state.currentPassword}
				onChange={this.onChangeCurrentPassword}
			/>
		
		if (this.state.locked){
			return (
				<p className='message--loading'>
					Updating user account...
				</p>
			)
		} else {
			return (
				<form onSubmit={this.updatePassword}>
					<table className='user-input__table--centered'>
						<tbody>
							<tr>
								<td>
									<label>New Password</label>
								</td>
								<td>
									{newPasswordInput}
								</td>
							</tr>
							<tr>
								<td>
									<label>Confirm Password</label>
								</td>
								<td>
									{confirmPasswordInput}
								</td>
							</tr>
							<tr>
								<td>
									<label>Current Password</label>
								</td>
								<td>
									{currentPasswordInput}
								</td>
							</tr>
						</tbody>
						<tfoot>
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
						</tfoot>
					</table>
				</form>
			)
		}
    }
}

export default EditPassword