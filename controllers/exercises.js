const exerciseRouter = require('express').Router()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

exerciseRouter.get('/', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table')
    const results = {'results': (result) ? result.rows : null}
    res.render('pages/db', results)
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
})

module.exports = exerciseRouter