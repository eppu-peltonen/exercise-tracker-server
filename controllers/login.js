const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const config = require('../utils/config')

loginRouter.post('/', async (req, res ) => {
  const body = req.body
  const result = await config.pool.query('select * from users where username=$1', [body.username])
  const user = result.rows[0]
  const passwordCorrect = user === undefined
    ? false
    : await bcrypt.compare(body.password, user.passwordhash)
  
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  //token expires in one hour
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {expiresIn: 60*60}
  )

  res
    .status(200)
    .send({
      token,
      id: user.id,
      username: user.username
    })
})

module.exports = loginRouter