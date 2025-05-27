const express = require('express')
const comController = require('../controller/commentController') 
const auth = require('../middleware/authentication')
const router = express.Router()


router.get('/:videoid/comment',comController.getComments)

router.post('/:videoid/comment',auth,comController.newComment)



module.exports = router