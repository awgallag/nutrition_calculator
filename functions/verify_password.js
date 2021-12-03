// Import npm packages
const bcrypt = require("bcryptjs")

// Import mongoose models
const User = require('../models/user')

/* The verifyPassword function ensures that a client provided the correct
	password for the account that the client is attempting to update by
	calling one of the update account endpoints. */
function verifyPassword(req, res, next) {	
	let userName = res.locals.user

	// Check if a password was provided by the client.
	if (!req.body.password){
		return res.status(400).send("Invalid Data")
	}
	
	// Check if the client provided the correct password.
	User.findOne({userName})
		.then((user) => {
			bcrypt.compare(req.body.password,user.passwordHash)
				.then((validPassword) => {
					if (!validPassword){
						console.log('Verify Password: Invalid password ' +
							'blocked.')
						return res.status(400).send("Invalid Password")
					} else {
						next()
					}
				})
				.catch(() => {
					console.log('Verify Password: failed to verify password.')
					return res.status(500).send("Internal Server Error")
				})
		}).catch(() => {
			console.log('Verify Password: failed to verify password.')
			return res.status(500).send("Internal Server Error")
		})
}

module.exports = verifyPassword