const config = require('./utils/config')
const express = require('express')
const app = express()
const exerciseRouter = require('./controllers/exercises')
const middleware = require('./utils/middleware')

app.use(middleware.requestLogger)

//Api route middlewares
app.use('/api/exercises', exerciseRouter)

app.use(middleware.unknownEndpoint)

module.exports = app