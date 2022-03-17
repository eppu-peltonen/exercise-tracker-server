const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const exerciseRouter = require('./controllers/exercises')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(middleware.requestLogger)

//Api route middlewares
app.use('/api/exercises', exerciseRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)

module.exports = app