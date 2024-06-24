const express = require('express');
const router = express.Router();
const User = require('../Moduls/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../authMiddleware');


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.get('/', (req, res) => {
    res.send('Server is running');
});

// Get all users
router.get('/users',authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a single user by ID
router.get('/users/:id',authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a user by ID
router.put('/users/:id', authMiddleware, async (req, res) => {
    try {
        const getUserPassword = await User.findOne({_id:req.params.id});
        if (!getUserPassword) {   
            return res.status(404).send({ error: 'User not found' });
        }
        else{
        const update_request = {
            ...req.body,
            password: getUserPassword.password
        }
        const userfound = await User.findOneAndUpdate({_id:req.params.id},update_request,{new:true});
      
        res.send({ statuscode: 0, Msg: "Updated successfully"});
        }

 
    } catch (err) {
        console.error('Error updating user:', err); // Add more detailed logging
        res.status(400).send(err);
    }
});
// Delete a user by ID
router.delete('/users/:id',authMiddleware, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id:req.params.id});
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({ statuscode: 0, Msg: "Delted successfully"});
    } catch (err) {
        res.status(500).send(err);
    }
});


//commen end point

// Create a new user
router.post('/register', async (req, res) => {
    try {
        const userEmail = await User.findOne({ email: req.body.email });
        const userName = await User.findOne({ username: req.body.name });
        if (userEmail) {
            return res.status(201).send(
                {statuscode:1,
                Msg: "User with this email already exists"
                });
        } else if (userName) {
            return res.status(201).send({statuscode:1,
                Msg: "User with this name already exists"
            });
        } else {
            const user = new User(req.body);
             await user.save();
             return res.status(201).send( {statuscode:0,
                Msg: "User created successfully"
                });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

//logon
router.post('/login', async (req, res) => {
    try {
      
        const user = await User.findOne({ email: req.body.email  });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        if (user.status === 0) {
            return res.status(401).send({ error: 'User is not active' });
        }
        if (user.password !== req.body.password) {
            return res.status(401).send({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ statuscode: 0, Msg: "Logged in successfully", token , user :user});
    } catch (err) {
        res.status(500).send(err);
    }
});

//forgot password
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const token = await user.generateResetToken();
        res.send({ statuscode: 0, Msg: "Password reset token sent successfully", token: token });
    } catch (err) {
        res.status(500).send(err);
    }
});

//reset password
router.post('/resetpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid password' });
        }
        const token = await user.generateResetToken();
        res.send({ statuscode: 0, Msg: "Password reset token sent successfully", token: token });
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = router;