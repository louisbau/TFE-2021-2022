const express = require("express");
const router = express.Router();
const { User, ChatRoomUser, ChatRoom, UserChatRoom, SubChatRoom, Friend, Message, FriendShip } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const verifyJWT = require("./isAuth");
require('dotenv').config()

router.get("/ping", (req, res) => {
    try {
        res.status(200).json('pong')
    }
    catch (error) {
        res.json(error)
    }
    
});

router.get("/list",verifyJWT, async (req, res) => {
    try {
        const listOfUser = await User.findAll();
        res.json(listOfUser);
    }
    catch (error) {
        res.json(error)
    }
});


router.get("/card",verifyJWT, async (req, res) => {
    try {
        const user = await User.findOne({where: {id : req.id.UserId}})
        res.json(user);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.get("/card/:id",verifyJWT, async (req, res) => {
    try {
        const user = await User.findOne({
            where: {id : req.params.id},
            attributes: ['id', 'name', "imageUri", "status"]
        })
        res.json(user);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.get("/authentification",verifyJWT, async (req, res) => {
    try {
        const result = {UserId :req.id.UserId, role: req.id.role}
        res.json(result);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.get("/:id",verifyJWT, async (req, res) => {
    try {
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
    }
    catch (error) {
        res.json(error)
    }
    
});


router.get('/forgot/:email', async (req, res) =>{
    try {
        await User.findOne({ where : {
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
    try {
        const { publicKey } = req.body;
        const userResult = await User.update({publicKey: publicKey}, {
            where : {id : req.id.UserId}
        })
        
        res.json(userResult);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.post("/addPics",verifyJWT, async (req, res) => {
    try {
        const { pics } = req.body;
        const userResult = await User.update({imageUri: pics}, {
            where : {id : req.id.UserId}
        })
        
        res.json(userResult);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.post("/register", async (req, res) => {
    try {
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
    }
    catch (error) {
        res.json(error)
    }
    
    
    
});



router.post("/login", async (req, res) => {
    try {
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
    }
    catch (error) {
        res.json(error)
    }

    
});


router.delete("/ban", async (req, res) => {
    try {
        const { id } = req.body;
        const listUserChat = await UserChatRoom.findAll(({
            where : {UserId : id}
        }))
        const FriendShipNumber = await Friend.findOne(({
            where : {UserId : id}
        }))

        index = []
        for (i in listUserChat) {
            index.push(listUserChat[i].id)
        }
        
        await Message.destroy(({
            where : {UserChatRoomId : index}
        }))

        await ChatRoomUser.destroy(({
            where : {UserChatRoomId : index}
        }))
        
        await UserChatRoom.destroy(({
            where : {id : index}
        }))

        await FriendShip.destroy(({
            where : {FriendId : FriendShipNumber.id}
        }))

        await FriendShip.destroy(({
            where : {UserId : id}
        }))

        await Friend.destroy(({
            where : {UserId : id}
        }))
        
        await User.destroy(({
            where : {id : id}
        }))
        
        res.json("succes")
    }
    catch (error) {
        res.json(error)
    }
    

});


module.exports = router;