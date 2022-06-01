const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, Friend, FriendShip } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");


router.get("/ping", (req, res) => {
    res.status(200).json('pong')
});


router.post("/addFriendship", verifyJWT, async (req, res) => {
    const { name } = req.body;
    const OtherUser = await User.findOne(({
        where : {name : name}
    }));
    const isMe = await Friend.findOne(({
        where : {UserId: req.id.UserId}
    }));

    const OtherFriend = await Friend.findOne(({
        where : {UserId: OtherUser.id}
    }));


    await FriendShip.create(({
        FriendId: OtherFriend.id,
        UserId: isMe.id
    }))
    res.json("success")

    
});


router.post("/acceptFriendship", verifyJWT, async (req, res) => {
    const { id } = req.body;
    const friendShipTable = await FriendShip.findOne(({where : {id: id}}))
    const other = await Friend.findOne(({
        where : {UserId: friendShipTable.UserId}
    }));

    await FriendShip.update({status: 'Accepted'}, {
        where : {id : id}
    })
    await FriendShip.create(({
        FriendId: other.id,
        UserId: req.id.UserId,
        status: 'Accepted'
    }))
    res.json("success")

    
});

router.delete("/declineFriendship", verifyJWT, async (req, res) => {
    const { id } = req.body;
    await FriendShip.destroy(({
       where: {id: id }
    }))
    res.json("success")
});

router.delete("/deleteFriendship", verifyJWT, async (req, res) => {
    const { id } = req.body; // 1	Accepted	1	2
    const friendShipTable = await FriendShip.findOne(({where : {id: id}}))  // 1	Accepted	1	2
    const other = await Friend.findOne(({
        where : {UserId: friendShipTable.UserId} 
    }));
    
    await FriendShip.destroy(({
       where: {id: id }
    }))
    await FriendShip.destroy(({
        where: {
            [Op.and]: [
              { FriendId: other.id },
              { UserId: req.id.UserId }
            ]
          }
     }))
    res.json("succes")

    
});


module.exports = router;