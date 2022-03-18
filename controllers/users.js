const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const config = require('../utils/config')

usersRouter.get('/', (req, res) => {
  //salasanan tiivistettä (passwordhash) ei lähetetä responsessa (tulee automaattisesti responseen, pitää poistaa jotenkin)
})

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
      const savedUser = result.rows[0]
      res.status(201).json({
        status: 'success',
        message: 'User added.',
        user: savedUser})
    }
  )
})

module.exports = usersRouter