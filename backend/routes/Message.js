const express = require("express");
const router = express.Router();
const { Message, User, ChatRoomUser, ChatRoom } = require("../models");
const moment = require("moment");
const verifyJWT = require("./isAuth");



router.get("/:id",verifyJWT, async (req, res) => {
    const listOfChatRoomUser = await Message.findAll(
        {
            where: {
                ChatRoomId: req.params.id
            }
        }
    )
    res.json(listOfChatRoomUser);
});



router.post("/",verifyJWT, async (req, res) => {
    const { content, image, audio, ChatRoomId } = req.body;
    Message.create(({
        content: content,
        image: image,
        audio: audio,
        ChatRoomId: ChatRoomId,
        UserId: req.id.UserId,
        createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }))
    .then(async (req2) => {
        ChatRoom.update({lastMessageId : req2.id}, {
            where : {id : req2.ChatRoomId}
        })
        const listOfChatRoomUser = await Message.findAll(
            {
                where: {
                    ChatRoomId: ChatRoomId
                }
            }
        )
        res.json(listOfChatRoomUser);
        
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error saving message"});
    });
    
});

module.exports = router;