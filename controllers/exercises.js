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

// Get all exercises
exerciseRouter.get('/', (req, res) => {
  config.pool.query("select id, user_id, sport, start_time, to_char(duration, 'HH24:MI:SS') as duration, distance, avg_hr from exercises;",
  (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

// Get exercises by user id
exerciseRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  await config.pool.query(
    "select id, user_id, sport, start_time, to_char(duration, 'HH24:MI:SS') as duration, distance, avg_hr from exercises where user_id=$1", [id],
    (error, results) => {
    if (error) {
      return error
    }
    res.status(200).json(results.rows)
  })
})

// Add new exercise
exerciseRouter.post('/', async (req, res) => {
  const {sport, start_time, duration, distance, avg_hr} = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const result = await config.pool.query('select * from users where id=$1', [decodedToken.id])
  const user = result.rows[0]

  try {
    const { rows } = await config.pool.query(
      'INSERT INTO exercises (user_id, sport, start_time, duration, distance, avg_hr) VALUES ($1, $2, $3, $4, $5, $6)', 
      [user.id, sport, start_time, duration, distance, avg_hr]
    )
    res.status(201).send('Exercise added')
  } catch(error) {
    return error
  }
})

// Delete exercise
exerciseRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  if (isNaN(id)) {
    return res.status(400).json({error: 'id must be a number'})
  }

  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  const result = await config.pool.query('select * from users where id=$1', [decodedToken.id])
  const user = result.rows[0]

  // Check if exercise exists and user owns the exercise
  const exerciseToDelete = await config.pool.query('select * from exercises where id=$1', [id])
  if (exerciseToDelete.rows.length === 0 || exerciseToDelete.rows[0].user_id !== user.id) {
    return res.status(404).json({error: 'exercise not found'})
  }

  try {
    await config.pool.query('DELETE FROM exercises WHERE id=$1 AND user_id=$2', [id, user.id])
    return res.status(200).json({
      status: "Success",
      message: "Exercise deleted"
    })
  } catch(error) {
    return error
  }
})


module.exports = exerciseRouter