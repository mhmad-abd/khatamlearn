const multerS3 = require('multer-s3');
const multer = require('multer');
const { s3 } = require('../utils/s3');

const storage = multerS3({
  s3: s3,
  bucket: 'khatamlearn',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE, // ⭐ نوع فایل درست ست میشه
  key: (req, file, cb) => {
    let folder = '';
    switch (file.fieldname) {
      case 'video':
        folder = 'videos/';
        break;
      case 'pdf':
        folder = 'pdfs/';
        break;
      case 'thumbnail':
        folder = 'image/thumbnails/';
        break;
      case 'profile':
        folder = 'image/profiles/';
        break;
      default:
        folder = 'others/';
    }
    cb(null, folder + Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4',
    'video/x-matroska',  
    'application/pdf',
    'image/jpeg',
    'image/png',         
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فرمت فایل معتبر نیست'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500 
  }
});

module.exports = upload;
