const express = require('express')
const router = express.Router()
const registerController= require('./../controller/registerController')


//routes
router.post('/register',registerController)

module.exports=router