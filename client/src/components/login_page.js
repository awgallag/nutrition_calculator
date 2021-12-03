// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './account/account_provider'

// Import css classes.
import './../styles/user_input.css'
import './../styles/message.css'

/*
	The LoginPage component provides an interface for user's to either log into
	their accounts or to create new accounts for the webapp.

	props:
	overlay - Set to true if the parent component is LoginOverlay.
	toggleOverlay - Toggles the overlay between the login and signup overlays.
	hideOverlay - Closes the overlay.
*/
class LoginPage extends Component {
	static contextType = AccountContext

	constructor(props) {
		super(props)
		
		this.login = this.login.bind(this)
		this.createAccount = this.createAccount.bind(this)
		this.onChangeUserName = this.onChangeUserName.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
		this.onChangeDateOfBirth = this.onChangeDateOfBirth.bind(this)
		this.onChangeSex = this.onChangeSex.bind(this)
		this.toggleSignup = this.toggleSignup.bind(this)
		this.setErrorMessage = this.setErrorMessage.bind(this)

		this.state = {
			userName: '',
			password: '',
			confirmPassword: '',
			dateOfBirth: '',
			sex: 'M',
			errorMessage: '',
			signup: false,
			locked: false
		}
	}

	onChangeUserName(e) {
		this.setState({
			userName: e.target.value
		})
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value
		})
	}
	
	onChangeConfirmPassword(e) {
		this.setState({
			confirmPassword: e.target.value
		})
	}
	
	onChangeDateOfBirth(e) {
		this.setState({
			dateOfBirth: e.target.value
		})
	}
	
	onChangeSex(e) {
		this.setState({
			sex: e.target.value
		})
	}
	
	toggleSignup(e){
		e.preventDefault()
		
		if(this.props.overlay){
			this.props.toggleOverlay()
		}
		
		this.setState({
			signup: !this.state.signup,
			errorMessage: ''
		})
	}
	
	setErrorMessage(){
		this.setState({
			locked: false,
			errorMessage: this.context.error.loginPage
		}, () => {
			this.context.acknowledgeError('loginPage')
		})
	}

	/* The login method uses the user input to log a user into their
		account. */
	login(e){
		e.preventDefault()
		const user = {
			userName:  this.state.userName,
			password: this.state.password		  
		}
		
		this.setState({
			locked: true
		},() => {
			this.context.login(user)
		})
	}
	
	/* The createAccount method creates a new user account if all of the user
		input is valid. */
	createAccount(e){
		e.preventDefault()
		let validated = this.validateInput()
		let user = {
			userName: this.state.userName,
			password: this.state.password,
			dateOfBirth: this.state.dateOfBirth,
			sex: this.state.sex
		}
		
		if (validated){
			this.setState({
				locked: true
			}, () => {
				this.context.createAccount(user)
			})
		}
	}
	
	/* The validateInput method returns true if all user input is valid and
		false otherwise. */
	validateInput(){
		let currentPassword = this.state.password
		let currentConfirmPassword = this.state.confirmPassword
		let currentErrorMessage = ''
		
		if (this.state.password !== this.state.confirmPassword){
			currentPassword = ''
			currentConfirmPassword = ''
			currentErrorMessage = 'Error: Passwords don\'t match'
		} else if (this.state.userName === ''){
			currentErrorMessage = 'Please provide a user name.'		
		} else if (this.state.password.length < 7){
			currentPassword = ''
			currentConfirmPassword = ''
			currentErrorMessage = 'Error: Passwords must be at least 7 ' +
				'characters long.'
		} else if (this.state.dateOfBirth === ''){
			currentErrorMessage = 'Please provide a data of birth.'
		} else {
			return true
		}
		
		this.setState({
			password: currentPassword,
			confirmPassword: currentConfirmPassword,
			errorMessage: currentErrorMessage
		})
		
		return false
	}
	
	componentDidUpdate(){
		if (this.context.authorized){
			this.props.hideOverlay()
		} else if (this.context.error.loginPage !== '') {
			this.setErrorMessage()
		}
	}

	render() {
		let usernameInput =
			<input
				className='user-input__input-box'
				type="text"
				value={this.state.userName}
				onChange={this.onChangeUserName}
			/>
			
		let passwordInput =
			<input
				className='user-input__input-box'
				type="password"
				value={this.state.password}
				onChange={this.onChangePassword}
			/>
		
		let confirmPasswordInput =
			<input
				className='user-input__input-box'
				type="password"
				value={this.state.confirmPassword}
				onChange={this.onChangeConfirmPassword}
			/>
			
		let dateOfBirthInput =
			<input
				className='user-input__input-box'
				type="date"
				value={this.state.dateOfBirth}
				onChange={this.onChangeDateOfBirth}
			/>
			
		let sexInput =
			<select
				className='user-input__input-box'
				value={this.state.sex}
				onChange={this.onChangeSex}>
				<option value="M">Male</option>
				<option value="F">Female</option>
			</select>
		
		if	(this.state.locked){
			return (
				<p className='message--loading'>
					logging into user account...
				</p>
			)
		} else {
			return (
				<form onSubmit=
					{ this.state.signup ? 
						this.createAccount 
					:
						this.login 
					}>
					<table className='user-input__table--centered'>
						<tbody>
							<tr>
								<td>
									<label>Username</label>
								</td>
								<td>
									{usernameInput}
								</td>
							</tr>
							<tr>
								<td>
									<label>Password</label>
								</td>
								<td>
									{passwordInput}
								</td>
							</tr>
							{ this.state.signup ?
								<>
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
											<label>Date Of Birth</label>
										</td>
										<td>
											{dateOfBirthInput}
										</td>
									</tr>
									<tr>
										<td>
											<label>Sex</label>
										</td>
										<td>
											{sexInput}
										</td>
									</tr>
								</>
							:
								null
							}
						</tbody>
						<tfoot>
							<tr>
								<td
									colSpan='2'
									className='user-input__td--centered'>
									{ this.state.signup ?
										<input
											type="submit"
											value="create account"
										/>
									:
										<input
											type="submit"
											value="login"
										/>
									}
									&nbsp;
									<button onClick={this.toggleSignup}>
										{ this.state.signup ?
												'log in'
											:
												'sign up'
										}
									</button>
								</td>
							</tr>
							<tr>
								<td colSpan='2'>
									<p className='message--error'>
										{this.state.errorMessage}
									</p>
								</td>
							</tr>
						</tfoot>
					</table>
				</form>
			)
		}
	}
}

export default LoginPage