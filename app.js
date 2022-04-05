const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const exerciseRouter = require('./controllers/exercises')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(middleware.requestLogger)
}

//Routes
app.use('/api/exercises', exerciseRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app