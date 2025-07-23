require('dotenv').config()
const AWS = require('aws-sdk');
const { urlencoded } = require('express');

const s3 = new AWS.S3({
    endpoint: 'https://s3.ir-thr-at1.arvanstorage.ir',
    credentials: {
        accessKeyId: process.env.ARVAN_ACCESS_KEY,
        secretAccessKey: process.env.ARVAN_SECRET_KEY
    },
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
})
const deleteFile = async (fileURL) => {
    const url = new URL(fileURL)
    const fullPath = decodeURIComponent(url.pathname).slice(1)
    const key = fullPath.replace(/^khatamlearn\//, '')
    try {
        await s3.deleteObject({
            Bucket: 'khatamlearn',
            Key: key,
        }).promise()
    } catch (e) {
        console.log('error while deleting file', e)
    }
}
module.exports = {
    s3,
    deleteFile
}