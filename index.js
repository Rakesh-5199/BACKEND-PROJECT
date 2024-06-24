require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userroutes = require('./Routers/userrouters');
const exprienceroutes = require('./Routers/Expriencerouters');
const imageroutes = require("./Routers/imagerouters")

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const bodyParser = require('body-parser');
// Middleware
app.use(cors({ origin: 'https://controller-eta.vercel.app'})); // Allow requests from http://localhost:3001
app.use(express.json());

// Routes
app.use('/', userroutes,exprienceroutes,imageroutes);

//upload files
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// MongoDB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
