const express = require('express')
const router = express.Router()
const seasonController = require('../controller/seasonController')
const auth = require('../middleware/authentication')
const verifyRole = require('../middleware/verifyRole')


router.post('/create/:courseId', auth, verifyRole, seasonController.addSeason)


module.exports = router