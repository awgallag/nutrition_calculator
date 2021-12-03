// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'

// Import css classes.
import './../../styles/message.css'
import './../../styles/user_input.css'

/* The EditAccountInformation component provides an interface for a client
	logged into a user account to change the user's sex and date of birth. */
class EditAccountInformation extends Component {
	static contextType = AccountContext

	constructor(props) {
		super(props)
		
		this.updateAccountInformation = 
			this.updateAccountInformation.bind(this)
		this.onChangeDateOfBirth = this.onChangeDateOfBirth.bind(this)
		this.onChangeSex = this.onChangeSex.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		
		this.state = {
			dateOfBirth: '',
			sex: '',
			password: '',
			message: '',
			messageStyle: '',
			locked: false
		}
	}
	
	updateAccountInformation(e){
		e.preventDefault()
		
		this.setState({
			locked: true
		}, () => {
			this.context.updateAccountInformation(this.state.dateOfBirth,
				this.state.sex, this.state.password)
		})
	}
	
	onChangeDateOfBirth(e){
		this.setState({
			dateOfBirth: e.target.value
		})
	}
	
	onChangeSex(e){
		this.setState({
			sex: e.target.value
		})	
	}
	
	onChangePassword(e){
		this.setState({
			password: e.target.value
		})
	}
	
	componentDidMount(){
		this.setState({
			dateOfBirth: this.context.dateOfBirth,
			sex: this.context.sex
		})
	}
	
	/* The componentDidUpdate method tells the component to display an error
		message if there was an error when attempting to update the user
		account in the database, or displays a confirmation message if the
		update was successful. */
	componentDidUpdate(){
		let error = this.context.error.editInfo
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
				locked: false,
				message: currentMessage,
				messageStyle: currentStyle
			}, () => {
				this.context.acknowledgeError('editInfo')
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
				<form onSubmit={this.updateAccountInformation}>
					<table className='user-input__table--centered'>
						<tbody>
							<tr>
								<td>
									<label>Date Of Birth</label>
								</td>
								<td>
									<input
										className='user-input__input-box'
										type="date"
										value={this.state.dateOfBirth}
										onChange={this.onChangeDateOfBirth}
									/>
								</td>
							</tr>
							<tr>
								<td>
									<label>Sex</label>
								</td>
								<td>
									<select
										className='user-input__input-box'
										value={this.state.sex}
										onChange={this.onChangeSex}>
										<option value="M">Male</option>
										<option value="F">Female</option>
									</select>
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

export default EditAccountInformation