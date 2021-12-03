// Import npm packages
const bcrypt = require("bcryptjs")
const express = require('express')

// Import mongoose models
const User = require('../models/user')
const Meal = require('../models/meal')
const FoodRecord = require('../models/food_record')

// Import middleware functions
const auth = require("../functions/authenticator")
const verifyPassword = require('../functions/verify_password')
const updateCookie = require('../functions/update_cookie')

const router = express.Router()

/* The getAll endpoint sends a user's: meals, foodRecords, date of birth, and
	sex to a client that is logged into the user's account and calls the
	endpoint.*/
router.get('/getAll',auth, (req, res) => {
	let userData = {
		meals: [],
		foodRecords: [],
		dateOfBirth: res.locals.dateOfBirth,
		sex: res.locals.sex
	}
	
	FoodRecord.find({ userName: res.locals.user })
		.then((foodRecords) => {
			Meal.find({ userName: res.locals.user })
				.then((meals) => {
					userData.meals = meals
					userData.foodRecords = foodRecords
					res.status(200).json(userData)
				})
				.catch(() => {
					console.log('getAll: Failed to get user data.')
					res.status(500).send('Failed to get user data.')
				})
        })
        .catch(() => {
            console.log('getAll: Failed to get user data.')
			res.status(500).send('Failed to get user data.')
        })
})

/* The updateAccountInformation endpoint accepts a date of birth and sex from a
	client that is logged into a user's account and updates that user's date of
	birth and sex. */
router.post('/updateAccountInformation', auth, verifyPassword,
	(req, res, next) => {
		if (!req.body.dateOfBirth || !req.body.sex){
			console.log('updateAccountInformation: Client provided invalid ' +
				'data.')
			return res.status(400).send('Invalid Data')
		}
		
		User.findOneAndUpdate({userName: res.locals.user},
			{dateOfBirth: req.body.dateOfBirth, sex: req.body.sex})
			.then(() => {
				res.locals.dateOfBirth = req.body.dateOfBirth
				res.locals.sex = req.body.sex
				next()
			})
			.catch(() => {
				console.log('updateAccountInformation: Failed to update ' +
					'user record.')
				return res.status(500).send('Failed to update user record.')
			})
	},
	updateCookie
)

/* The updateUsername endpoint accepts a username from a client that is logged
	into a user's account and updates that user's username. */
router.post('/updateUsername', auth, verifyPassword,
	async (req, res, next) => {
		try {
			let newUsername = req.body.newUsername
			let response
			let userResponse
			let mealResponse
			let foodRecordResponse
			
			// Check if a new username was sent by the client.
			if (!newUsername){
				console.log('updateUsername: No username provided.')
				return res.status(400).send('No username provided.')
			}
			
			// Check if the username is already taken.
			response = await User.findOne({userName: newUsername})
			
			if (response) {
				console.log('updateUsername: Username is already taken.')
				return res.status(400).send('Username is already taken.')
			}
			
			// Update the user's username for all of the user's account assets.
			userResponse = User.findOneAndUpdate({userName: res.locals.user},
				{userName: newUsername})
				
			mealResponse = Meal.updateMany({userName: res.locals.user},
				{userName: newUsername})
				
			foodRecordResponse = FoodRecord.updateMany(
				{userName: res.locals.user}, {userName: newUsername})
				
			await Promise.all([userResponse, mealResponse, foodRecordResponse])
			
			res.locals.user = newUsername
			
			next()
		} catch {
			console.log('updateUsername: Internal Server Error.')
			return res.status(500).send('Internal Server Error')
		}
	},
	updateCookie
)

/* The updatePassword endpoint accepts a password from a client that is logged
	into a user account and updates that user's password. */
router.post('/updatePassword', auth, verifyPassword,
	async (req, res) => {
		try {
			let newPassword = req.body.newPassword
			let salt
			let newPasswordHash
			
			// Check if a new password was sent by the client.
			if (!newPassword){
				console.log('updatePassword: No New Password Provided')
				return res.status(400).send('No New Password Provided')
			}
			
			// Create a passwordHash for the new password.
			salt = await bcrypt.genSalt()
			newPasswordHash = await bcrypt.hash(newPassword, salt)
			
			// Save the new passwordHash to the database.
			await User.findOneAndUpdate({userName: res.locals.user},
				{passwordHash: newPasswordHash})
				
			return res.status(200).send('Account Information Updated')
		} catch {
			console.log('updatePassword: Internal Server Error')
			return res.status(500).send('Internal Server Error')
		}
	}
)

/* The deleteAccount endpoint deletes a user's account when the endpoint is
	called by a client that is logged into the user's account. */
router.post('/deleteAccount', auth, verifyPassword,
	async (req, res) => {
		try {
			let userResponse = User.deleteOne({userName: res.locals.user})
			let mealResponse = Meal.deleteMany({userName: res.locals.user})
			let foodRecordResponse = FoodRecord.deleteMany({userName:
				res.locals.user})
			
			await Promise.all([userResponse, mealResponse, foodRecordResponse])
			
			res.cookie("token", "", {
				httpOnly: true,
				expires: new Date(0)
			}).status(200).send('Account Deleted')
		} catch {
			console.log('deleteAccount: Internal Server Error')
			res.status(500).send('Internal Server Error')
		}
	}
)

module.exports = router