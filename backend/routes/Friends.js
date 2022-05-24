const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, Friend, FriendShip } = require("../models");
const verifyJWT = require('./isAuth')

router.get("/list",verifyJWT, async (req, res) => {
    const listOfFriends = await Friend.findOne(({
        where : {UserId : req.id.UserId},
        include: {
            model: FriendShip,
        }
    }));
    const list = listOfFriends.dataValues
    
    if(!list["FriendShips"][0]){
        list["FriendShips"] = null
    }
    else {
        for (i in list.FriendShips) {
            list["FriendShips"][i] = list.FriendShips[i].dataValues
            const u = await User.findOne(({where: {id : list.FriendShips[i]["UserId"]}}))
            const userValue = u.dataValues
            list.FriendShips[i]["imageUri"] = userValue.imageUri
            list.FriendShips[i]["status"] = userValue.status
        }
    }
    res.json(list);
});

router.get("/:id",verifyJWT, async (req, res) => {
    const listOfChatRoomUser = await User.findAll({ include: [{
        model: ChatRoomUser,
        where: {ChatRoomId: req.params.id}
       }, {
        model: Message,
        where: {ChatRoomId: req.params.id}
       }] 
    });
    res.json(listOfChatRoomUser);
});



module.exports = router;