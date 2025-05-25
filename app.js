const express = require('express')
const cors = require('cors');
const {auth} = require('./middleware/authentication')
const registerRoute=require('./route/register')
const connectDB=require('./utils/connectDB') 
const serachRoute= require('./route/serach')
// Initialization
const app = express();
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());


// API Routes

app.use('/api',registerRoute)
app.use('/api',serachRoute)

module.exports = app;