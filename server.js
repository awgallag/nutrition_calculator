// Import npm packages
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// Import routes
const authRoutes = require('./routes/auth')
const mealRoutes = require('./routes/meals')
const foodRecordRoutes = require('./routes/food_record')
const userRoutes = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 8080

// Load process.env variable values.
require('dotenv').config()

/* Connect to MongoDB Atlas if in production mode, otherwise connect to local
	mongoDB database. */
if (process.env.NODE_ENV === 'production') {
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).catch((error) => {
		console.log("Mongoose failed to connect to MongoDB.")
	})
} else {
	mongoose.connect('mongodb://127.0.0.1:27017/data',{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).catch((error) => {
		console.log("Mongoose failed to connect to MongoDB.")
	})
}

// Verify that mongoose sucessfully connected to MongoDB.
mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to MongoDB')
})

// Load tools
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(morgan('tiny'))

// Load routes
app.use('/auth', authRoutes)
app.use('/meals', mealRoutes)
app.use('/foodRecord', foodRecordRoutes)
app.use('/user', userRoutes)

// Load front-end
if(process.env.NODE_ENV === 'production') {
	app.use(express.static('./client/build'))
}

// Start the server
app.listen(PORT, console.log(`Server is starting at ${PORT}`))