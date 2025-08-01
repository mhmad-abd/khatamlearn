const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const videoController = require('../controller/videoController')
const verifyRole = require('../middleware/verifyRole')
const upload = require('../middleware/upload');




router.get('/:videoid', auth, videoController.getVideo)
router.post('/upload', auth, verifyRole, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.createVideo)
router.post('/:videoid/like', auth, videoController.likedVideo)
router.delete('/:videoid', auth, verifyRole, videoController.deleteVideo)
module.exports = router