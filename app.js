//Packages
const express = require('express')
const cors = require('cors');
const cookieParser= require('cookie-parser')
const {auth} = require('./middleware/authentication')
const connectDB=require('./utils/connectDB') 

// Calling the route
const serachRoute= require('./route/serach')
const registerRoute=require('./route/register')
const loginRote=require('./route/login')
const commentRoute=require('./route/commentRoute')

const Video = require('./models/Video')
// Initialization
const app = express();
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// API Routes

app.use('/api',registerRoute)
app.use('/api',serachRoute)
app.use('/api',loginRote)
app.use('/api/video',commentRoute)



//test
const upload = require('./middleware/upload')
app.post('/upload',upload.fields([{name:'video',maxCount:1},{name:'pdf',maxCount:1}]),(req,res)=>{
     if (!req.files['video']) {
      return res.status(400).json({ error:'you must upload a video'});
    }
    res.json({
      videoUrl: req.files['video'][0].location,
      pdfUrl: req.files['pdf'] ? req.files['pdf'][0].location : null})
})
//end of test



// Exportig app
module.exports = app;