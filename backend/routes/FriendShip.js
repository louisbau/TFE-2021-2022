const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, Friend, FriendShip } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");


router.get("/ping", (req, res) => {
    try {
        res.status(200).json('pong')
    }
    catch (error) {
        res.json(error)
    }
    
});


router.post("/addFriendship", verifyJWT, async (req, res) => {
    try {
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
    }
    catch (error) {
        res.json(error)
    }
    

    
});


router.post("/acceptFriendship", verifyJWT, async (req, res) => {
    try {
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
    }
    catch (error) {
        res.json(error)
    }
    

    
});

router.delete("/declineFriendship", verifyJWT, async (req, res) => {
    try {
        const { id } = req.body;
        await FriendShip.destroy(({
            where: {id: id }
        }))
        res.json("success")
    }
    catch (error) {
        res.json(error)
    }
    
});

router.delete("/deleteFriendship", verifyJWT, async (req, res) => {
    try {
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

    }
    catch (error) {
        res.json(error)
    }
    
    
});


module.exports = router;