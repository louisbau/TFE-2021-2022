const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, Friend, FriendShip } = require("../models");
const verifyJWT = require('./isAuth')

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
        const listOfFriends = await Friend.findOne(({
            where : {UserId : req.id.UserId},
            include: {
                model: FriendShip,
                where: {status: 'Accepted'}
            }
        }));
        if (!listOfFriends) {
            const list = {}
            list["FriendShips"] = null
            res.json(list);
        }
        else {
            const list = listOfFriends["FriendShips"]
            
            if(!list){
                list = null
            }
            else {
                for (i in list) {
                    list[i] = list[i].dataValues
                    const u = await User.findOne(({where: {id : list[i]["UserId"]}}))
                    const userValue = u.dataValues
                    list[i]["imageUri"] = userValue.imageUri
                    list[i]["name"] = userValue.name
                    list[i]["status"] = userValue.status
                }
            }
            res.json(list);
        }
    }
    catch (error) {
        res.json(error)
    }
    
    
});

router.get("/listWaiting",verifyJWT, async (req, res) => {

    try {
        const listOfFriends = await Friend.findOne(({
            where : {UserId : req.id.UserId},
            include: {
                model: FriendShip,
                where: {status: 'Waiting'}
            }
        }));
        if (!listOfFriends) {
            const list = {}
            list["FriendShips"] = null
            res.json(list);
        }
        else {
            const list = listOfFriends["FriendShips"]
            
            if(!list){
                list = null
            }
            else {
                for (i in list) {
                    list[i] = list[i].dataValues
                    const u = await User.findOne(({where: {id : list[i]["UserId"]}}))
                    const userValue = u.dataValues
                    list[i]["imageUri"] = userValue.imageUri
                    list[i]["name"] = userValue.name
                    list[i]["status"] = userValue.status
                }
            }
            res.json(list);
        }
    }
    catch (error) {
        res.json(error)
    }
    
    
});

router.get("/:id",verifyJWT, async (req, res) => {
    try {
        const listOfChatRoomUser = await User.findAll({ include: [{
            model: ChatRoomUser,
            where: {ChatRoomId: req.params.id}
           }, {
            model: Message,
            where: {ChatRoomId: req.params.id}
           }] 
        });
        res.json(listOfChatRoomUser);
    }
    catch (error) {
        res.json(error)
    }
    
});



module.exports = router;