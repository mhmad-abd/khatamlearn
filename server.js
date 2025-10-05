// lirary
const http = require('http')
const fs = require('fs')
const app = require('./app')

const port = process.env.PORT || 5000


// Running server
const server = http.createServer(app)

server.listen(port,()=>{
    console.log(`HTTP server is running on localhost:${port}`);
})