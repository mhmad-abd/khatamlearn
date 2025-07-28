const multerS3 = require('multer-s3')
const multer = require('multer')
const { s3 } = require('../utils/s3')

const storage = multerS3({
    s3: s3,
    bucket: 'khatamlearn',
    acl: 'public-read',
    key: (req, file, cb) => {
        let folder = ''
        switch (file.fieldname) {
            case 'video':
                folder = 'videos/'
                break
            case 'pdf':
                folder = 'pdfs/'
                break
            case 'thumbnail':
                folder = 'image/thumbnails'
                break
            case 'profile':
                folder = 'image/profiles'
                break
        }
        cb(null, folder + Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4',
        'video/mkv',
        'application/pdf',
        'image/jpeg'
    ]
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(new Error('file foramt is not valid'), false)
    }
}

const upload = multer({
    storage,
    fileFilter
})

module.exports = upload