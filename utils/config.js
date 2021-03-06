require('dotenv').config()
const pg = require('pg')

//Development environment connects to local database
//Prod connects to heroku database
const isProduction = process.env.NODE_ENV === 'production'
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new pg.Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? {rejectUnauthorized: false} : false
})

const PORT = process.env.PORT

module.exports = {
  pool, PORT
}