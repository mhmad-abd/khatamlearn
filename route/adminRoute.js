const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')


//Major route
router.post('/major',adminController.addMajor)
router.get('/major',adminController.getMajor)
router.put('/major/:id',adminController.updateMajor)
router.delete('/major/:id',adminController.deleteMajor)

//request teacher 
router.post('/request-teacher', adminController.getRequest)
router.post('/approve-request/:id', adminController.approveRequest)
router.get('/decline-request/:id', adminController.declineRequest)
router.post('/demote-teacher/:id', adminController.demoteTeacher)
module.exports = router