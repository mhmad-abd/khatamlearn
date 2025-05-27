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


app.post('/add/video',async(req,res)=>{
    const {title, description,url,uploader,genre}=req.body
    try{    
        const newvideo = new Video({title,description,url,uploader,genre})
        await newvideo.save();
        res.status(201)
    }catch(e){
        res.status(500).json({error:e.message})
    }
})

// Exportig app
module.exports = app;