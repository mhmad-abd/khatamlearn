require('dotenv').config();

// Packages
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/authentication');
const connectDB = require('./utils/connectDB');

// Routes
const serachRoute = require('./route/serachRoute');
const commentRoute = require('./route/commentRoute');
const userRoute = require('./route/userRoute');
const videoRoute = require('./route/videoRoute');
const reportRoute = require('./route/reportRoute');
const adminRoute = require('./route/adminRoute');
const verifyAdmin = require('./middleware/verifyAdmin');
const courseRoute = require('./route/courseRoute');
const seasonRoute = require('./route/seasonRoute');

// Initialization
const app = express();
connectDB();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
  // اگر نیاز داری، آدرس تونل Cloudflare رو هم اینجا اضافه کن
];

// Middlewares
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: function(origin, callback) {
    // اجازه برای localhost، تونل Cloudflare و درخواست‌هایی بدون origin (مثل Postman)
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith(".trycloudflare.com"))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', serachRoute);
app.use('/api/video/comments', commentRoute);
app.use('/api/user', userRoute);
app.use('/api/video', videoRoute);
app.use('/api/report', reportRoute);
app.use('/api/admin', auth, verifyAdmin, adminRoute);
app.use('/api/course', courseRoute);
app.use('/api/season', seasonRoute);

// Export app
module.exports = app;
