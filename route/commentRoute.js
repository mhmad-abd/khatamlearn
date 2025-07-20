const express = require('express')
const comController = require('../controller/commentController') 
const auth = require('../middleware/authentication')
const router = express.Router()


router.get('/:videoid/comment',comController.getComments)
router.post('/:videoid/comment',auth,comController.newComment)
router.post('/:videoid/comment/:commentID',auth,comController.newReply)
router.get('/comment/replies/:commentID',comController.getReplies)


module.exports = router