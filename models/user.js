// Import npm packages
const mongoose = require('mongoose')

// Creates a User model for mongoose.
const Schema = mongoose.Schema

let UserSchema = new Schema(
	{
		userName: {
			type: String,
			required: true
		},
		passwordHash: {
			type: String,
			required: true
		},
		dateOfBirth: {
			type: String,
			required: true		
		},
		sex: {
			type: String,
			required: true
		}
	},
	{
		collection: 'users'
	}
)

const User = mongoose.model('user', UserSchema)

module.exports = User