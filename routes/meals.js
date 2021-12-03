// Import npm packages
const express = require('express')

// Import mongoose models
const Meal = require('../models/meal')

// Import middleware functions
const auth = require("../functions/authenticator")

const router = express.Router()

/* The addMeal endpoint accepts a Meal object from a client that is logged into
	a user account and adds the Meal object to the database. */
router.post('/addMeal',auth, (req, res) => {
    let newMeal = new Meal({
		userName: res.locals.user,
		mealName: req.body.mealName,
		foodObjects: req.body.foodObjects
	})
	
	newMeal.save()
		.then(() => {
			res.status(200).send('Meal added to database.')
		})
		.catch(() => {
			console.log('addMeal: Failed to add meal to database.')
			res.status(500).send('Failed to add meal to database.')
		})
})

/* The removeMeal endpoint accepts a mealName from a client logged into a user
	account and deletes the Meal with that mealName from the user's account. */
router.post('/removeMeal', auth, (req, res) => {
	Meal.deleteOne({ userName: res.locals.user, mealName: req.body.mealName })
		.then(() => {
            res.status(200).send('Meal object deleted from database')
        })
        .catch(() => {
			console.log('removeMeal: Failed to remove Meal from the database.')
            res.status(500).send('Failed to delete Meal from database.')
        })
})

/* The getMeals endpoint sends all of a user's Meals to a client when a client
	logged into that user's account calls the endpoint. */
router.get('/getMeals',auth, (req, res) => {
	Meal.find({ userName: res.locals.user })
		.then((meals) => {
            res.status(200).json(meals)
        })
        .catch(() => {
            console.log('getMeals: failed to get Meal objects from database.')
			res.status(500).send('Failed to get Meals.')
        })
})

module.exports = router