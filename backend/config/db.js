const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected successfully..!")
    } catch(err) {
        console.log("Error connecting to MongoDB : ", err)
        process.exit(1)
    }
}

module.exports = connectDB