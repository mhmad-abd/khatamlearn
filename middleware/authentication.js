const jwt = require('jsonwebtoken')
require("dotenv").config();
const auth=(req, res, next)=> {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_KEY_JWT, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


module.exports={
    auth
}