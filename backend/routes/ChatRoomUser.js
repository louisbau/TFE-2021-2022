const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message } = require("../models");

router.get("/list", async (req, res) => {
    const listOfChatRoomUser = await ChatRoomUser.findOne();
    res.json(listOfChatRoomUser);
});

router.get("/:id", async (req, res) => {
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