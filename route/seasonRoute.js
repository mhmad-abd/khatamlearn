const express = require('express')
const router = express.Router()
const seasonController = require('../controller/seasonController')
const auth = require('../middleware/authentication')
const verifyRole = require('../middleware/verifyRole')


router.post('/create/:courseId', auth, verifyRole, seasonController.addSeason)
router.put('/edit/:id', auth, verifyRole, seasonController.updateSeason)
router.delete('/delete/:id', auth, verifyRole, seasonController.deleteSeason)


module.exports = router