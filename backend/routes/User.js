const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv').config()

router.get("/list", async (req, res) => {
    const listOfUser = await User.findAll();
    res.json(listOfUser);
});

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    User.findOne({ where : {
        email: email, 
    }})
    .then(dbUser => {
        if(dbUser) {
            return res.status(409).json({message: "email already exists"});
        } else if (email && password) {
            bcrypt.hash(password, 12, (err, passwordHash) => {
                if (err) {
                    return res.status(500).json({message: "couldnt hash the password"}); 
                } else if (passwordHash) {
                    return User.create(({
                        email: email,
                        name: name,
                        password: passwordHash,
                    }))
                    .then(() => {
                        res.status(200).json({message: "user created"});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({message: "error while creating the user"});
                    });
                };
            })
        }
    })
    .catch(err => {
        console.log('error', err);
    });
    
    
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;
    console.log(email, password)
    User.findOne({ where : {
        email: email, 
    }})
    .then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({message: "user not found"});
        } else {
            // password hash
            bcrypt.compare(password, dbUser.password, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user password"});
                } else if (compareRes) { // password match
                    const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
                    console.log(token)
                    res.status(200).json({message: "user logged in", "token": token});
                } else { // password doesnt match
                    res.status(401).json({message: "invalid credentials"});
                };
            });
        };
    })
    .catch(err => {
        console.log('error', err);
    });
});


const verifyJWT = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

router.post('/isUserAuth', (req, res) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    console.log(authHeader)
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message || 'could not decode the token' });
        
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
        
    } else {
        res.status(200).json({ message: 'here is your resource' });
        
    };
});

module.exports = router;