const express = require('express');
const router = express.Router();
const Exprience = require('../Moduls/Exprience');
const authMiddleware = require('../authMiddleware');


router.post('/exprienceadd',authMiddleware, async (req, res) => {
    try {
            const exprience = new Exprience(req.body);
             await exprience.save();
             return res.status(201).send( {statuscode:0, Msg: "Exprience created successfully"});
        
    } catch (err) {
        res.status(400).send(err);
    }

})

router.get('/exprience', async (req, res) => {
    try {
        const exprience = await Exprience.find();
        res.send(exprience);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a single user by ID
router.get('/exprience/:id',authMiddleware, async (req, res) => {
    try {
        const exprience = await Exprience.findById(req.params.id);
        if (!exprience) {
            return res.status(404).send({ error: 'Exprience not found' });
        }
        res.send(exprience);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.put('/exprience/:id', authMiddleware, async (req, res) => {
    try {
        const experience = await Exprience.findOneAndUpdate({ _id: req.params.id },req.body,{ new: true });
        if (!experience) {
            return res.status(404).send({ error: 'Exprience not found' });
        }
        res.send({ statuscode: 0, Msg: "Updated successfully"});
    } catch (err) {
        console.error('Error updating exprience:', err); 
        res.status(400).send(err);
    }
});

router.delete('/exprience/:id',authMiddleware, async (req, res) => {
    try {
        const exprience = await Exprience.findOneAndDelete({_id:req.params.id});
        if (!exprience) {
            return res.status(404).send({ error: 'Exprience not found' });
        }
        res.send({ statuscode: 0, Msg: "Delted successfully"});
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;