// Import npm packages
const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Import mongoose models
const User = require('../models/user')

// Import middleware functions
const auth = require("../functions/authenticator")

const router = express.Router()

// The create-user endpoint creates new user accounts.
router.post('/create-user', async (req, res) => {
	try {
		let userName = req.body.userName
		let password = req.body.password
		let dateOfBirth = req.body.dateOfBirth
		let sex = req.body.sex
		let userExists
		let salt
		let passwordHash
		let user
		let savedUser
		let token
		
		/* Check if client sent all of the necassary information
			required to create a new user account. */
		if (!userName || !password || !dateOfBirth || !sex){
			console.log("create-user: Invalid data sent to server.")
			return res.status(400).send("Invalid Data.")
		}
		
		// Check if the username sent by the client is already taken.
		userExists = await User.findOne({userName})
		
		if (userExists) {
			console.log("create-user: User already in the database.")
			return res.status(400).send("User name is already taken.")
		}
		
		// Create a passsword hash.
		salt = await bcrypt.genSalt()
		passwordHash = await bcrypt.hash(password, salt)
		
		// Add the new user account to the database.
		user = new User({
			userName,
			passwordHash,
			dateOfBirth,
			sex
		})
		
		savedUser = await user.save()
		
		// Log the client into the new user account.
		token = jwt.sign(
			{
				user: savedUser.userName,
				dateOfBirth: savedUser.dateOfBirth,
				sex: savedUser.sex
			},
			process.env.JWT_KEY
		)
		
		res.cookie("token", token, {
			httpOnly: true
		}).status(200).send()
		
	} catch {
		// Send error message if a failure occurs.
		console.log('create-user: Failed to create new user account.')
		res.status(500).send('Internal Server Error')
	}
})

// The login endpoint logs a client into a user account.
router.post('/login', async (req, res) => {
	try {
		let userName = req.body.userName
		let password = req.body.password
		let user
		let validPassword
		let token
		
		// Check if the client sent a username and password.
		if (!userName || !password) {
			console.log("login: Invalid data sent to server.")
			return res.status(400).send("Invalid data.")
		}
		
		// Check if there is an account for the username sent by the client.
		user = await User.findOne({userName})
		
		if (!user) {
			console.log("login: Invalid username sent to server.")
			return res.status(400).send("Invalid user password pair.")
		}
		
		// Check if the password and username sent by the client match.
		validPassword = await bcrypt.compare(password, user.passwordHash)
		
		if (!validPassword) {
			console.log("login: Invalid password sent to server.")
			return res.status(400).send("Invalid user password pair.")
		}
		
		// Create jsonwebtoken cookie
		token = jwt.sign(
			{
				user: user.userName,
				dateOfBirth: user.dateOfBirth,
				sex: user.sex
			},
			process.env.JWT_KEY
		)

		// Send jsonwebtoken cookie to the client
		res.cookie("token", token, {
			httpOnly: true
		}).status(200).send()
		
	} catch {
		// Send error message if a failure occurs.
		console.log('login: Failed to log client into user account.')
		res.status(500).send('Internal Server Error')
	}
})

// The logout endpoint logs a client out of a user account.
router.post('/logout', async (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(0)
	}).status(200).send()
})

/* The authorized-user endpoint checks if a client is logged into a user
	account. */
router.get('/authorized-user', (req, res) => {
	try {
		let token = req.cookies.token
		
		// Check if the client has a cookie
		if (!token) {
			return res.json(false)
		}
		
		// Verify that the client's cookie was signed by the server.
		jwt.verify(token, process.env.JWT_KEY)
		
		return res.json(true)

	} catch {
		return res.json(false)
	}
})

module.exports = router