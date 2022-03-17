const exerciseRouter = require('express').Router()
const config = require('../utils/config')

exerciseRouter.get('/', (req, res) => {
  config.pool.query('SELECT * FROM exercises', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})


exerciseRouter.post('/', (req, res) => {
  const {user_id, sport, start_time, duration, distance, avg_hr} = req.body

  config.pool.query(
    'INSERT INTO excercises (user_id, sport, start_time, duration, distance, avg_hr) VALUES ($1, $2, $3, $4, $5, $6)', 
    [user_id, sport, start_time, duration, distance, avg_hr],
    (error) => {
      if (error) {
        throw error
      }
      res.status(201).json({status: 'success', message: 'Exercise added.'})
    }
  )
})

module.exports = exerciseRouter