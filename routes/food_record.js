// Import npm packages
const express = require('express')

// Import mongoose models
const FoodRecord = require('../models/food_record')

// Import middleware functions
const auth = require("../functions/authenticator")

const router = express.Router()

/* The createFoodRecord endpoint accepts a foodRecord object from a client that
	is logged into a user account and adds that foodRecord to the database. */
router.post('/createFoodRecord',auth, (req, res) => {
	let newFoodRecord = new FoodRecord({
		userName: res.locals.user,
		date: req.body.date,
		record: req.body.record
	})
	
	newFoodRecord.save()
		.then(() => {
			res.status(200).send('FoodRecord added to database.')
		})
		.catch(() => {
			console.log('createFoodRecord: Failed to create food record.')
			res.status(500).send('Failed to add FoodRecord to database.')
		})
})

/* The removeFoodRecord endpoint accepts a date from a client that is logged
	into a user account, and deletes the user's foodRecord for that date. */
router.post('/removeFoodRecord', auth, (req, res) => {
	FoodRecord.deleteOne({ userName: res.locals.user, date: req.body.date })
		.then(() => {
            res.status(200).send('FoodRecord deleted from database.')
        })
        .catch(() => {
			console.log('removeFoodRecord: Failed to remove food record.')
            res.status(500).send('Failed to delete FoodRecord from database.')
        })
})

/* The getUserFoodRecords endpoint sends all of a user's foodRecords to a
	client when the client is logged into the user's account and calls the
	endpoint. */
router.get('/getUserFoodRecords',auth, (req, res) => {
	FoodRecord.find({ userName: res.locals.user })
		.then((foodRecords) => {
            res.status(200).json(foodRecords)
        })
        .catch(() => {
            console.log('getUserFoodRecords: Failed to get FoodRecords.')
			res.status(500).send('Failed to get FoodRecords.')
        })
})

/* The updateFoodRecord endpoint updates a user's foodRecord when the date for
	that foodRecord is sent with an updated FoodRecord from a client that is
	logged into the user's account. */
router.post('/updateFoodRecord', auth, (req, res) => {
	FoodRecord.findOneAndUpdate({ userName: res.locals.user, date:
		req.body.date },{ record: req.body.record })
		.then(() => {
			res.status(200).send('Updated FoodRecord.')
		})
		.catch(() => {
            console.log('updateFoodRecord: Failed to update FoodRecord.')
			res.status(500).send('Failed to update FoodRecord.')
		})
})

module.exports = router