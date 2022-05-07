const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom } = require("../models");
const verifyJWT = require('./isAuth')

router.post("/newChatRoom/", verifyJWT, async (req, res) => {
    const { user } = req.body;
    
    const chatRoom = await ChatRoom.create()
    
    ChatRoomUser.create(({
        ChatRoomId: chatRoom.id,
        UserId: req.id.UserId
    }))
    ChatRoomUser.create(({
        ChatRoomId: chatRoom.id,
        UserId: user
    }))
    Message.create(({
        content: 'first 0',
        ChatRoomId: chatRoom.id,
        UserId: req.id.UserId,
    }))
    const mess = await Message.create(({
        content: 'first 1',
        ChatRoomId: chatRoom.id,
        UserId: user,
    }))
    ChatRoom.update({lastMessageId : mess.id}, {
        where : {id : chatRoom.id}
    })
    res.json(chatRoom.id);
});

router.get("/list", async (req, res) => {
    const listOfChatRoomUser = await ChatRoomUser.findOne();
    res.json(listOfChatRoomUser);
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