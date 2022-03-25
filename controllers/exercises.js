const exerciseRouter = require('express').Router()
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

exerciseRouter.get('/', async (req, res) => {
  config.pool.query(
    'select * from exercises',
    (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

exerciseRouter.post('/', async (req, res) => {
  const {sport, start_time, duration, distance, avg_hr} = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }
  const result = await config.pool.query('select * from users where id=$1', [decodedToken.id])
  const user = result.rows[0]

  config.pool.query(
    'INSERT INTO exercises (user_id, sport, start_time, duration, distance, avg_hr) VALUES ($1, $2, $3, $4, $5, $6)', 
    [user.id, sport, start_time, duration, distance, avg_hr],
    (error) => {
      if (error) {
        throw error
      }
      res.status(201).json({status: 'success', message: 'Exercise added.'})
    }
  )
})

module.exports = exerciseRouter