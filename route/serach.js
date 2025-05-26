const express = require('express')
const searchController  = require('../controller/searchController ')
const router = express.Router()

router.get('/serach',searchController )

module.exports = router