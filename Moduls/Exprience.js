const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ExprienceSchema = new mongoose.Schema({
    Role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
    },
    startdate: {
        type: String,
        required: true
    },
    enddate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
       type:Number,
       required:true 
    }
});



const User = mongoose.model('Exprience', ExprienceSchema);

module.exports = User;
