// Import npm packages.
import React, { Component } from 'react'
import axios from 'axios'

const AccountContext = React.createContext()

/* The AcccountProvider component provides other components with methods to
	log into, log out of, and edit a user account. The component also stores all
	of a user's records and account information while the client is logged into
	the user's account. */
class AccountProvider extends Component {
	constructor(props) {
        super(props)
		
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.createAccount = this.createAccount.bind(this)
		this.confirmAuth = this.confirmAuth.bind(this)
		this.updateAccountInformation = this.updateAccountInformation.bind(this)
		this.updateUsername = this.updateUsername.bind(this)
		this.updatePassword = this.updatePassword.bind(this)
		this.deleteAccount = this.deleteAccount.bind(this)
		this.setMeals = this.setMeals.bind(this)
		this.setFoodRecords = this.setFoodRecords.bind(this)
		this.acknowledgeError = this.acknowledgeError.bind(this)
		
		this.state = {
			authorized: false,
			meals: [],
			foodRecords: [],
			dateOfBirth: '',
			sex: '',
			nutritionGroup: '',
			loginPage: '',
			deleteAccount: '',
			editInfo: '',
			editPassword: '',
			editUsername: ''
		}
	}
	
	setMeals(updatedMeals){
		this.setState({
			meals: updatedMeals
		})
	}

	setFoodRecords(updatedFoodRecords){
		this.setState({
			foodRecords: updatedFoodRecords
		})
	}
	
	acknowledgeError(callingComponent){
		this.setState({
			[callingComponent]: ''
		})
	}
	
	/*
		The login method logs the client into the user account defined by the
		user object passed in as an argument.
		
		parameters:
		user - an object containing userName and password properties.
	*/
	login(user){
		let currentNutritionGroup = ''
		let errorMessage = ''
		
		axios.post('/auth/login', user)
			.then(() => {
				axios.get('/user/getAll')
					.then((response) => {
						currentNutritionGroup = this.calculateNutritionGroup(
							response.data.dateOfBirth, response.data.sex)
						
						this.setState({
							authorized: true,
							meals: response.data.meals,
							foodRecords: response.data.foodRecords,
							dateOfBirth: response.data.dateOfBirth,
							sex: response.data.sex,
							nutritionGroup: currentNutritionGroup
						})
					})
					.catch(() => {
						this.setState({
							loginPage: 'Network connection failed.'
						})
					})
			})
			.catch((error) => {
				if (error.message === 'Request failed with status code 400'){
					errorMessage = 'Invalid username or password.'
				} else {
					errorMessage = 'Network connection failed.'
				}
				
				this.setState({
					loginPage: errorMessage
				})
			})
	}
	
	/* The logout method logs the client out of the user account that the
		client is currently logged into. */
	logout(){
		axios.post('/auth/logout')
			.then(() => {
				//Updates url address
				//window.history.replaceState(null, "Login", "/")

				this.setState({
					authorized: false,
					meals: [],
					foodRecords: [],
					nutritionGroup: '',
					dateOfBirth: '',
					sex: ''
				})
			})
			.catch(function (error){
				console.log(error)
			})
	}
	
	/*
		The createAccount method creates an account in the server's database
		with the provided user object's properties.
		
		parameters:
		user - an object containing userName, password, dateOfBirth, and sex
			properties.
	*/
	createAccount(user){
		let currentNutritionGroup = this.calculateNutritionGroup(
			user.dateOfBirth, user.sex)
		let errorMessage = ''
		
		axios.post('auth/create-user', user)
			.then(() => {
				this.setState({
					authorized: true,
					dateOfBirth: user.dateOfBirth,
					sex: user.sex,
					nutritionGroup: currentNutritionGroup
				})
			})
			.catch((error) => {
				if (error.message === 'Request failed with status code 400'){
					errorMessage = 'Error: username already taken.'
				} else {
					errorMessage = 'Network connection failed.'
				}
				
				this.setState({
					loginPage: errorMessage
				})
			})
	}

	/* The confirmAuth method checks to see if the client is logged into a user
		account. */
	confirmAuth(){
		let currentNutritionGroup = ''
		if (this.state.authorized === false){
			axios.get('/auth/authorized-user')
				.then((authorized) => {
					if (authorized.data){
						axios.get('/user/getAll')
							.then((response) => {
								currentNutritionGroup =
									this.calculateNutritionGroup(
										response.data.dateOfBirth,
										response.data.sex)
								this.setState({
									authorized: true,
									meals: response.data.meals,
									foodRecords: response.data.foodRecords,
									dateOfBirth: response.data.dateOfBirth,
									sex: response.data.sex,
									nutritionGroup: currentNutritionGroup
								})
							})
							.catch((error) => {
								console.log(error)
							})
					}
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	
	/* The updateAccountInformation method updates the date of birth and sex of
		the user account that the client is logged into. */
	updateAccountInformation(newDateOfBirth, newSex, password){
		let currentNutritionGroup = ''
		let errorMessage = ''
		let data = {
			dateOfBirth: newDateOfBirth,
			sex: newSex,
			password: password
		}
		
		axios.post('user/updateAccountInformation', data)
			.then(() => {
				currentNutritionGroup = this.calculateNutritionGroup(
					data.dateOfBirth, data.sex)

				this.setState({
					dateOfBirth: newDateOfBirth,
					sex: newSex,
					nutritionGroup: currentNutritionGroup,
					editInfo: 'none'
				})
			})
			.catch((error) => {
				if (error.response.status === 400){
					errorMessage = 'Invalid password'
				} else {
					errorMessage = 'Network connection failed.'
				}
				this.setState({
					editInfo: errorMessage
				})
			})
	}
	
	/* The updateUsername method updates the user's username to the newUsername
		sent as an argument. */
	updateUsername(newUsername, password){
		let errorMessage = ''
		let data = {
			newUsername: newUsername,
			password: password
		}
		
		axios.post('user/updateUsername', data)
			.then(() => {
				this.setState({
					editUsername: 'none'
				})
			})
			.catch((error) => {
				if (error.response.status === 400){
					errorMessage = error.response.data
				} else {
					errorMessage = 'Network connection failed.'
				}
				this.setState({
					editUsername: errorMessage
				})
			})
	}
	
	/* The updatePassword method updates the user's password to the newPassword
		sent as an argument. */
	updatePassword(newPassword, password){
		let errorMessage = ''
		let data = {
			newPassword: newPassword,
			password: password
		}
		
		axios.post('user/updatePassword', data)
			.then(() => {
				this.setState({
					editPassword: 'none'
				})
			})
			.catch((error) => {
				if (error.response.status === 400){
					errorMessage = error.response.data
				} else {
					errorMessage = 'Network connection failed.'
				}
				this.setState({
					editPassword: errorMessage
				})
			})
	}
	
	/* The deleteAccount method deletes the user account that the client is
		currently logged into. */
	deleteAccount(password){
		let errorMessage = ''
		let data = {
			password: password
		}
		
		axios.post('user/deleteAccount', data)
			.then(() => {
				this.setState({
					authorized: false,
					meals: [],
					foodRecords: [],
					nutritionGroup: '',
					dateOfBirth: '',
					sex: ''
				})	
			})
			.catch((error) => {
				if (error.response.status === 400){
					errorMessage = error.response.data
				} else {
					errorMessage = 'Network connection failed.'
				}
				this.setState({
					deleteAccount: errorMessage
				})
			})
	}

	/* The calculateNutritionGroup method returns the nutrition group that a
		person with the given dateOfBirth and sex belongs to. */
	calculateNutritionGroup(dateOfBirth, sex){
		let birthArray = dateOfBirth.split('-')
		let today = new Date()
		let birthDay = parseInt(birthArray[2])
		let birthMonth = parseInt(birthArray[1])
		let birthYear = parseInt(birthArray[0])
		let currentDay = parseInt(today.getDate())
		let currentMonth = parseInt(today.getMonth()) + 1
		let currentYear = parseInt(today.getFullYear())
		let age = 0
		let nutritionGroup = ''
		
		// Calculate how many years old the user is.
		if (currentMonth < birthMonth){
			// Birthday hasn't occured for current year.
			age = currentYear - birthYear - 1
		} else if (currentMonth > birthMonth){
			age = currentYear - birthYear
		} else {
			if (currentDay < birthDay){
				// Birthday hasn't occured for current year.
				age = currentYear - birthYear - 1
			} else {
				age = currentYear - birthYear
			}
		}
		
		// Assign the user to a nutritionGroup based on age and sex.
		if (age < 1){
			let numMonths
			
			if (currentYear === birthYear){
				numMonths = currentMonth - birthMonth
			} else {
				numMonths = (12 - birthMonth) + currentMonth 
			}

			if (numMonths === 6){
				if (currentDay < birthDay){
					nutritionGroup = '0-6'
				} else {
					nutritionGroup = '6-12'			
				}
			} else if (numMonths < 6){
				nutritionGroup = '0-6'
			} else {
				nutritionGroup = '6-12'
			}
		} else if ( age < 4) {
			nutritionGroup = '1-3'
		} else if ( age < 9) {
			nutritionGroup = '4-8'
		} else if ( age < 14) {
			nutritionGroup = sex + '9-13'
		} else if ( age < 19) {
			nutritionGroup = sex + '14-18'
		} else if ( age < 31) {
			nutritionGroup = sex + '19-30'
		} else if ( age < 51) {
			nutritionGroup = sex + '31-50'
		} else if ( age < 71) {
			nutritionGroup = sex + '51-70'
		} else {
			nutritionGroup = sex + '>70'
		}
		
		return nutritionGroup
	}

	render() {
		let errorMessages = {
			loginPage: this.state.loginPage,
			deleteAccount: this.state.deleteAccount,
			editAccount: this.state.editAccount,
			editInfo: this.state.editInfo,
			editPassword: this.state.editPassword,
			editUsername: this.state.editUsername
		}
		
        return (
			<AccountContext.Provider
				value={{
					authorized: this.state.authorized,
					meals: this.state.meals,
					foodRecords: this.state.foodRecords,
					dateOfBirth: this.state.dateOfBirth,
					sex: this.state.sex,
					nutritionGroup: this.state.nutritionGroup,
					error: errorMessages, 
					login: this.login,
					logout: this.logout,
					createAccount: this.createAccount,
					confirmAuth: this.confirmAuth,
					updateAccountInformation: this.updateAccountInformation,
					updateUsername: this.updateUsername,
					updatePassword: this.updatePassword,
					deleteAccount: this.deleteAccount,
					setMeals: this.setMeals,
					setFoodRecords: this.setFoodRecords,
					acknowledgeError: this.acknowledgeError
				}}>
				{this.props.children}
			</AccountContext.Provider>
        )
    }
}

export default AccountContext
export { AccountProvider }