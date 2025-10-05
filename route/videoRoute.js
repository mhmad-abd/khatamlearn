const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const videoController = require('../controller/videoController')
const verifyRole = require('../middleware/verifyRole')
const upload = require('../middleware/upload');
const { Route53RecoveryControlConfig } = require('aws-sdk')




router.get('/:videoid', auth, videoController.getVideo)
router.post('/upload/:seasonId', auth, verifyRole, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), videoController.createVideo)
router.post('/:videoid/like', auth, videoController.likedVideo)
router.delete('/:videoid', auth, verifyRole, videoController.deleteVideo)
router.put('/edit/:videoId',auth, verifyRole,upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), videoController.updateVideo)

module.exports = router