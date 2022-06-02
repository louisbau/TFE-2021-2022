const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, ReportMessage } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");


router.post("/message", verifyJWT, async (req, res) => {
    const { id, reason } = req.body;
    await ReportMessage.create(({
        reason: reason,
        MessageId : id
    }))
    
    res.json("success report")

    
});

module.exports = router;