const exerciseRouter = require('express').Router()

exerciseRouter.get('/', (req, res) => {
  res.send("haloo")
})

module.exports = exerciseRouter