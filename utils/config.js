require('dotenv').config()
const {Pool} = require('pg')

const isProduction = process.env.NODE_ENV === 'production'
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

/*
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL
} else if (process.NODE_ENV === 'development') {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
}
*/

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
})

const PORT = process.env.PORT

module.exports = {
  pool, PORT
}