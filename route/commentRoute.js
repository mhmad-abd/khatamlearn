const express = require('express')
const comController = require('../controller/commentController') 
const auth = require('../middleware/authentication')
const router = express.Router()


router.get('/:courseId/comment',comController.getComments)
router.post('/:courseId/comment',auth,comController.newComment)
router.post('/:courseId/comment/:commentID',auth,comController.newReply)
router.get('/comment/replies/:commentID',comController.getReplies)


module.exports = router