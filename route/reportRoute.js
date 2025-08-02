const express = require('express')
const router = express.Router()
const reportController = require('../controller/reportController')
const auth = require('../middleware/authentication')
const verifyAdmin = require('../middleware/verifyAdmin')

router.post('/', auth, reportController.createReport)
router.get('/', auth, verifyAdmin, reportController.getReports)

module.exports = router