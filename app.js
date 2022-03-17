const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const exerciseRouter = require('./controllers/exercises')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(middleware.requestLogger)

//Api route middlewares
app.use('/api/exercises', exerciseRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)

module.exports = app