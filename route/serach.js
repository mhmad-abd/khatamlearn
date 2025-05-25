const express = require('express')
const serachController = require('../controller/serachController')
const router = express.Router()

router.get('/serach',serachController)

module.exports = router