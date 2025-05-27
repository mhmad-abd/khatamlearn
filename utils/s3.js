require('dotenv').config()
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint:'https://s3.ir-thr-at1.arvanstorage.ir',
    credentials:{
        accessKeyId:process.env.ARVAN_ACCESS_KEY,
        secretAccessKey:process.env.ARVAN_SECRET_KEY
    },
    s3ForcePathStyle:true,
    signatureVersion:'v4'
})

module.exports = s3