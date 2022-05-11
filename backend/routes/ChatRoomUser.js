const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom } = require("../models");
const verifyJWT = require('./isAuth')
const { QueryTypes } = require("sequelize");

router.post("/newChatRoom/", async (req, res) => {
    const { user } = req.body;
    const users = await sequelize.query(
        "select distinct a.*, b.* from chatroomusers as a join chatroomusers as b on a.ChatRoomId = b.ChatRoomId join chatrooms as c on b.ChatRoomId = c.id where (a.UserId = :userA and b.UserId = :userB) and c.isGroupe = False",
        { 
            nest: true,
            replacements : { userA: 3, userB: 1},
            type: QueryTypes.SELECT 
        }
    );
    /*
    
    const test = await ChatRoom.findAll(({
        include:{
            model: ChatRoomUser,
            where: {UserId : 1}
        }
    }))
    const test2 = await test.findOne(({
        where : {UserId : 3}
    }))
    
    for (i in test) {
        console.log(test[i].dataValues)
    }
    
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
    */
    console.log(users)
    res.json(users);
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