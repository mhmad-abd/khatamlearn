const express = require('express')
const cors = require('cors');
const {auth} = require('./middleware/authentication')
const tokenGenerator = require('./utils/tokenGenerator')

// Initialization
const app = express();



// Load env variables
// dotenv.config();



// Middlewares
app.use(cors());
app.use(express.json());


// API Routes


// !!!! testing jwt !!!!
// app.post('/login',(req,res)=>{
//     const username = req.body.username
//     const user ={name:username}
//     const token = tokenGenerator(user)
//     res.json({token:token})
// })

// app.get('/api/profile', auth, (req, res) => {
//   res.json({ message: `خوش آمدی ${req.user.name}` });
// });


module.exports = app;