// Import npm packages
const mongoose = require('mongoose')

// Creates a Meal model for mongoose.
const Schema = mongoose.Schema

let MealSchema = new Schema(
	{
		userName: {
			type: String,
			required: true
		},
		mealName: {
			type: String,
			required: true
		},
		foodObjects: {
			type: Array,
			required: true
		}
	},
	{
		collection: 'meals'
	}
)

const Meal = mongoose.model('meal', MealSchema)

module.exports = Meal