const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authConfig = require('../config/auth.json');
const router = express.Router();

function generateToken(params = {} ){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    });
};

const getUsers = async (req, res) => {
    let users = await User.find({});

    return res.status(200).send({users});
}

router.get('/users', getUsers);

router.post('/register', async (req,res) => {
    const { email } = req.body;
    try{
        if (await User.findOne({ email })){
            return res.status(400).send({ error: 'User already registered' })
        }

        const user = await User.create(req.body);
        
        user.password = undefined;

        console.log('user', req.body);

        return res.send({ user,
            token: generateToken({ id: user.id }), 
        });
    } catch (err) {
        return res.status(400).send({ error: `Registration failed - ${err}` });
    }
});

router.post('/authenticate', async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found'});
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'invalid password'});
    
    user.password = undefined;


    res.send({ user, 
        token: generateToken({ id: user.id }) 
    });
});

module.exports = app => app.use('/auth', router);