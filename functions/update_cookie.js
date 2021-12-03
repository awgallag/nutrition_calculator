// Import npm packages
const jwt = require('jsonwebtoken')

/* The updateCookie function sends an updated cookie to a client after the
	client calls one of the update account endpoints. */ 
function updateCookie(req, res) {
	try {
		// Create jsonwebtoken cookie
		const token = jwt.sign(
			{
				user: res.locals.user,
				dateOfBirth: res.locals.dateOfBirth,
				sex: res.locals.sex
			},
			process.env.JWT_KEY
		)

		// Send jsonwebtoken cookie to the client
		res.cookie("token", token, {
			httpOnly: true
		}).status(200).send('Account Information Updated')
	} catch {
		// Send error message if a failure occurs
		console.log('updateCookie: Failed to send updated cookie.')
		res.status(500).send('Internal Server Error')
	}
}

module.exports = updateCookie