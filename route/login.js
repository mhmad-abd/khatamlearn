const express = require('express')
const loginController = require('./../controller/loginController')
const router = express.Router()


router.post('/login',loginController)




module.exports = router