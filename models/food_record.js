// Import npm packages
const mongoose = require('mongoose')

// Creates a FoodRecord model for mongoose.
const Schema = mongoose.Schema

let FoodRecordSchema = new Schema(
	{
		userName: {
			type: String,
			required: true
		},
		date: {
			type: String,
			required: true
		},
		record: {
			type: Array,
			required: true
		}
	},
	{
		collection: 'foodRecord'
	}
)

const FoodRecord = mongoose.model('foodRecord', FoodRecordSchema)

module.exports = FoodRecord