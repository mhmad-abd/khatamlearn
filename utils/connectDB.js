require('dotenv').config()
const mongoose =  require('mongoose')


const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_LOCAL);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
    }
};
module.exports= connectDB;