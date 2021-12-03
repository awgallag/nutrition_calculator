// Import npm packages
const jwt = require('jsonwebtoken')

/* The auth function protects endpoints by making sure that any client using
	the endpoints has a valid cookie. */
function auth(req, res, next) {
	let token = req.cookies.token
	
	// Check if the client has a cookie.
	if (!token) {
		console.log("auth: Unauthorized access blocked.")
		return res.status(401).send("Unauthorized access blocked.")
	}

	// Verify that the client's cookie was signed by the server.
	jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
		if (error){
			console.log("auth: Unauthorized access blocked.")
			return res.status(401).send("Unauthorized access blocked.")
		} else {
			res.locals.user = payload.user
			res.locals.dateOfBirth = payload.dateOfBirth
			res.locals.sex = payload.sex
			next()
		}
	})
}

module.exports = auth