const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const config = require('../utils/config')

// Get all users
usersRouter.get('/', (req, res) => {
  config.pool.query('select username, fname, lname from users', (error, result) => {
    if (error) {
      throw error
    }
    res.json(result.rows)
  })
})

// Add user
usersRouter.post('/', async (req, res) => {

  //Salasana tulee req.bodysta ja tässä funktiossa luodaan tiiviste joka tallennetaan kantaan
  const { username, fname, lname, password } = req.body

  if (password === undefined) {
    return res.status(400).json({error: 'password is missing'})
  }
  if (password.length < 4) {
    return res.status(400).json({error: 'password is too short'})
  }

  const saltRounds = 10
  const passwordhash = await bcrypt.hash(password, saltRounds)

  config.pool.query(
    'INSERT INTO users (username, fname, lname, passwordhash) VALUES ($1, $2, $3, $4)',
    [username, fname, lname, passwordhash],
    (error, result) => {
      if (error) {
        throw error
      }
      //Saved userin näyttäminen onnistuneen requestin responssa ei toimi
      const savedUser = result.rows[0]
      res.status(201).json({
        status: 'success',
        message: 'User added.',
        user: savedUser})
    }
  )
})

module.exports = usersRouter