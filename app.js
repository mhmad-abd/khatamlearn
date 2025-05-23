const express = require('express')
const cors = require('cors');
const {auth} = require('./middleware/authentication')
const tokenGenerator = require('./utils/tokenGenerator')
const registerRoute=require('./route/register')
const connectDB=require('./utils/connectDB') 
// Initialization
const app = express();
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());


// API Routes

app.use('/api',registerRoute)


module.exports = app;