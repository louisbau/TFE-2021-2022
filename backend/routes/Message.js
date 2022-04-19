const express = require("express");
const router = express.Router();
const { Message, User, ChatRoomUser } = require("../models");
const moment = require("moment")

router.get("/:id", async (req, res) => {
    const listOfChatRoomUser = await Message.findAll(
        {
            where: {
                ChatRoomId: req.params.id
            }
        })
    res.json(listOfChatRoomUser);
});

router.post("/", async (req, res) => {
    const { content, image, audio, ChatRoomId, UserId } = req.body;
    Message.create(({
        content: content,
        image: image,
        audio: audio,
        ChatRoomId: ChatRoomId,
        UserId: UserId,
        createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }))
    .then(() => {
        res.status(200).json({message: "message store"});
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error saving message"});
    });
    
});

module.exports = router;