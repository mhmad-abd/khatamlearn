const multerS3 = require('multer-s3')
const multer = require('multer')
const { s3 } = require('../utils/s3')

const storage = multerS3({
    s3: s3,
    bucket: 'khatamlearn',
    acl: 'public-read',
    key: (req, file, cb) => {
        let folder = ''
        if (file.mimetype.startsWith('video/')) {
            folder = 'videos/'
        } else if (file.mimetype === 'application/pdf') {
            folder = 'pdfs/'
        } else if (file.mimetype === 'image/jpeg') {
            folder = 'image/profiles/'
        }
        cb(null, folder + Date.now() + '-' + file.originalname)
    }
})

const uploadVid = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
            cb(null, true)
        }
        else {
            cb(new Error('file foramt is not valid'), false)
        }
    }
})

const uploadProfilePic = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(new Error('file format is not valid'), false)
        }
    }
})

const uploadPDF = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('file format is not valid'), false)
        }
    }
})

module.exports = {
    uploadVid,
    uploadProfilePic,
    uploadPDF
}