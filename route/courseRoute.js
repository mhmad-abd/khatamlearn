const express = require('express')
const router = express.Router()
const courseController = require('../controller/courseController')
const auth = require('../middleware/authentication')
const verifyRole = require('../middleware/verifyRole')
const upload = require('../middleware/upload')


router.post('/create', auth, verifyRole, upload.single('thumbnail'), courseController.addCourse)
router.get('/:id', courseController.getCourse)
router.get('/', courseController.getAllCourses)
router.get('/delete/:id', auth, verifyRole, courseController.deleteCourse)
router.put('/edit/:id', auth, verifyRole, courseController.updateCourse)

module.exports = router