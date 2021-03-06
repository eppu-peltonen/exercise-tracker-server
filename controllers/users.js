const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const config = require('../utils/config')

// Get all users
usersRouter.get('/', (req, res) => {
  config.pool.query('select id, username from users', (error, result) => {
    if (error) {
      throw error
    }
    res.status(200).json(result.rows)
  })
})

// Add user
usersRouter.post('/', async (req, res) => {

  const { newUser, newPassword } = req.body

  if (newPassword === undefined || newPassword === null) {
    return res.status(400).json({error: 'password is missing'})
  }
  if (newPassword.length < 4) {
    return res.status(400).json({error: 'password is too short'})
  }

  //Check if user exists
  const result = await config.pool.query('select * from users where username=$1', [newUser])
  if (result.rows.length > 0) {
    return res.status(400).json({error: 'user already exists'})
  }

  const saltRounds = 10
  const passwordhash = await bcrypt.hash(newPassword, saltRounds)

  config.pool.query(
    'INSERT INTO users (username, passwordhash) VALUES ($1, $2)',
    [newUser, passwordhash],
    (error, result) => {
      if (error) {
        return res.json({error: error})
      }
      res.status(201).send("Registration completed")
    }
  )
})

module.exports = usersRouter