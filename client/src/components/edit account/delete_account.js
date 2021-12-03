// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import AccountContext from './../account/account_provider'

// Import css classes.
import './../../styles/message.css'
import './../../styles/user_input.css'

/* The DeleteAccount component provides an inferface for a client logged into a
	user account to delete the user's account. */
class DeleteAccount extends Component {
	static contextType = AccountContext
	
	constructor(props) {
		super(props)
		
		this.deleteAccount = this.deleteAccount.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		
		this.state = {
			password: '',
			message: '',
			messageStyle: '',
			locked: false
		}
	}
	
	deleteAccount(e){
		e.preventDefault()
		this.setState({
			locked: true
		}, () => {
			this.context.deleteAccount(this.state.password)
		})
	}
	
	onChangePassword(e){
		this.setState({
			password: e.target.value
		})
	}
	
	/* The componentDidUpdate method tells the component to display an error
		message if there was an error when attempting to delete the user
		account from the database. */
	componentDidUpdate(){
		let error = this.context.error.deleteAccount
		
		if (error !== ''){
			this.setState({
				password: '',
				locked: false,
				message: 'Error: ' + error,
				messageStyle: 'message--error'
			}, () => {
				this.context.acknowledgeError('deleteAccount')
			})
		}
	}
	
	render() {
		let messageRow =
			<tr>
				<td colSpan='2'>
					<p className={this.state.messageStyle}>
						{this.state.message}
					</p>
				</td>
			</tr>
		
		if (this.state.locked){
			return (
				<p className='message--loading'>
					Deleting user account...
				</p>
			)
		} else {
			return (
				<>
					<p>
						Warning: If you enter your password and click on the
						delete account button, then your account will be
						permanently deleted.
					</p>
					<form onSubmit={this.deleteAccount}>
						<table className='user-input__table--centered'>
							<tbody>
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
											value="delete account"
										/>
									</td>
								</tr>
								{ this.state.message !== '' ?
									messageRow
								:
									null
								}
							</tfoot>
						</table>
					</form>
				</>
			)
		}
    }
}

export default DeleteAccount