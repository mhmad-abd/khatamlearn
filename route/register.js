const express = require('express')
const router = express.Router()
const user = require('./../models/User')
const registerController= require('./../controller/registerController')


//routes
router.post('/register',registerController)

module.exports=router