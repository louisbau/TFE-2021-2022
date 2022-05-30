const express = require("express");
const router = express.Router();
const { User, ChatRoomUser, ChatRoom, UserChatRoom, SubChatRoom, Friend } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const verifyJWT = require("./isAuth");
require('dotenv').config()


router.get("/list",verifyJWT, async (req, res) => {
    const listOfUser = await User.findAll();
    res.json(listOfUser);

});



router.get("/card",verifyJWT, async (req, res) => {
    const user = await User.findOne({where: {id : req.id.UserId}})
    res.json(user);
});

router.get("/authentification",verifyJWT, async (req, res) => {
    const result = {UserId :req.id.UserId, role: req.id.role}
    res.json(result);
});

router.get("/:id",verifyJWT, async (req, res) => {
    const listOfUserq = await UserChatRoom.findAll({ include: [{
        model: ChatRoomUser,
        where: {SubChatRoomId: req.params.id}
       }] 
    });

    
    listUserCopy = listOfUserq.map(x => x.dataValues);
    for (a in listUserCopy) {
        let img = await User.findOne({
            where : {id : listUserCopy[a].UserId}
        })
        img = img.dataValues
        listUserCopy[a]["imageUri"] = img.imageUri
        listUserCopy[a]["publicKey"] = img.publicKey
    }
    

    res.json(listUserCopy);
});

router.get('/logout', verifyJWT, (req, res) => {
    req.session = null
    res.redirect('/Login')
})

router.get('/forgot/:email', async (req, res) =>{
    try {
      
        User.findOne({ where : {
            email: req.params.email
        }})
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({message: "wrong email"});
            } else {
                // password hash
                const token = jwt.sign({ email: dbUser.email, UserId: dbUser.id, role: dbUser.role}, process.env.TOKEN_SECRET, { expiresIn: '15m' });
                return res.status(200).json({message: "you can change your password", token: token, UserId: dbUser.id});
            };
        })
        .catch(err => {
            console.log('error', err);
        });
      // res.status(200).send(`User with id ${username} was not found`)
    } catch (error) {
      res.status(400).send(error.message)
      res.json({ message: 'no user exits', valid: false })
    }
})

router.post('/newPassword', verifyJWT, async function (req, res) {
    try {
        const { password } = req.body
        User.findOne({ where : {
            id: req.id.UserId, 
        }})
        .then(async (dbUser)  => {
            if(!dbUser) {
                return res.status(409).json({message: "error"});
            } else if (password) {
                await bcrypt.hash(password, 12, (err, passwordHash) => {
                    if (err) {
                        return res.status(500).json({message: "couldnt hash the password"}); 
                    } else if (passwordHash) {
                        User.update({password: passwordHash}, {
                            where : {id : dbUser.id}
                        })
                        return res.status(200).json({message: "change password"}); 
                    };
                })
            }
        })
        .catch(err => {
            console.log('error', err);
        });
        
    } catch (error) {
      res.status(400).send(error.message)
    }
})

router.post("/addPublicKey",verifyJWT, async (req, res) => {
    const { publicKey } = req.body;
    const userResult = await User.update({publicKey: publicKey}, {
        where : {id : req.id.UserId}
    })
    
    res.json(userResult);
});

router.post("/addPics",verifyJWT, async (req, res) => {
    const { pics } = req.body;
    const userResult = await User.update({imageUri: pics}, {
        where : {id : req.id.UserId}
    })
    
    res.json(userResult);
});

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    User.findOne({ where : {
        email: email, 
    }})
    .then(async (dbUser)  => {
        if(dbUser) {
            return res.status(409).json({message: "email already exists"});
        } else if (email && password && password.length > 9) {
            await bcrypt.hash(password, 12, (err, passwordHash) => {
                if (err) {
                    return res.status(500).json({message: "couldnt hash the password"}); 
                } else if (passwordHash) {
                    return User.create(({
                        email: email,
                        name: name,
                        password: passwordHash,
                    }))
                    .then(async (result)  => {
                        await Friend.create(({
                            UserId: result.id
                        }))
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
                    const token = jwt.sign({ email: email, UserId: dbUser.id, role:  dbUser.role}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
                    res.status(200).json({message: "user logged in", token: token, UserId: dbUser.id});
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


router.post('/isUserAuth', (req, res) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
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