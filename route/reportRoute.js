const express = require('express')
const router = express.Router()
const reportController = require('../controller/reportController')
const auth = require('../middleware/authentication')
const verifyAdmin = require('../middleware/verifyAdmin')

router.post('/video/:videoid', auth, reportController.createReportForVideo)
router.post('/comment/:commentid', auth, reportController.createReportForComment)
router.get('/video', auth, verifyAdmin, reportController.getVideoReports)
router.get('/comment', auth, verifyAdmin, reportController.getCommentReports)

module.exports = router