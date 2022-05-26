const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, Friend, FriendShip } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");

router.post("/addFriendship", verifyJWT, async (req, res) => {
    const { name } = req.body;
    const friendName = await User.findOne(({
        where : {name : name}
    }));
    const friendid = await Friend.findOne(({
        where : {UserId: req.id.UserId}
    }));

    await FriendShip.create(({
        pseudo: name,
        FriendId: friendid.id,
        UserId: friendName.id
    }))
    res.json("succes")

    
});

router.delete("/deleteFriendship", verifyJWT, async (req, res) => {
    const { id } = req.body;
    

    await FriendShip.destroy(({
       where: {id: id }
    }))
    res.json("succes")

    
});


module.exports = router;