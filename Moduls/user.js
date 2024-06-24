const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },  
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
   
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
};

// Custom findByIdAndUpdate method
userSchema.statics.findByIdAndUpdateUser = async function(id, update, options = { new: true }) {
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
    return this.findByIdAndUpdate(id, update, options);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
