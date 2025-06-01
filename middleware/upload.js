const multerS3 = require('multer-s3')
const multer = require('multer')
const s3 = require('../utils/s3')


const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:'khatamlearn',
        acl:'public-read',
        key:(req,file,cb)=>{
            let folder = ''
            if(file.mimetype.startsWith('video/')){
                folder = 'videos/'
            }else if(file.mimetype ==='application/pdf'){
                folder ='pdfs/'
            }
            cb(null,folder + Date.now()+'-'+file.originalname)
        }
    }),
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith('video/')||file.mimetype ==='application/pdf'){
            cb(null,true)
        }
        else{
            cb(new Error('file foramt is not valid'),false)
        }
    }
})
module.exports = upload