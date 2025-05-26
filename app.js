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

// Exportig app
module.exports = app;