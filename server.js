// lirary
const https = require('https')
const fs = require('fs')
const app = require('./app')


// Certificate keys
const sslOptions = {
    key:fs.readFileSync('./ssl/key.pem'),
    cert:fs.readFileSync('./ssl/cert.pem')
}

// Running server
const server = https.createServer(sslOptions,app)

server.listen(443,()=>{
    console.log("HTTPS server is running on localhost");
})