require('dotenv').config
//Packages
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const auth = require('./middleware/authentication')
const connectDB = require('./utils/connectDB')

// Calling the route
const serachRoute = require('./route/serachRoute')
const commentRoute = require('./route/commentRoute')
const userRoute = require('./route/userRoute')
const videoRoute = require('./route/videoRoute')
const reportRoute = require('./route/reportRoute')
const adminRoute = require('./route/adminRoute');
const verifyAdmin = require('./middleware/verifyAdmin');
// Initialization
const app = express();
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// API Routes


app.use('/api', serachRoute)
app.use('/api/video', commentRoute)
app.use('/api/user', userRoute)
app.use('/api/video', videoRoute)
app.use('/api/report', reportRoute)
app.use('/api/admin', auth, verifyAdmin, adminRoute)


// Exportig app
module.exports = app;