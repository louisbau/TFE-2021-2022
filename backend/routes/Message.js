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
    console.log(image)
    Message.create(({
        content: content,
        image: image.blobId,
        audio: audio,
        ChatRoomId: ChatRoomId,
        UserId: req.id.UserId,
        createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }))
    .then((req2) => {
        ChatRoom.update({lastMessageId : req2.id}, {
            where : {id : req2.ChatRoomId}
        })
        res.status(200).json({message: "message store"});
        
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error saving message"});
    });
    
});

module.exports = router;