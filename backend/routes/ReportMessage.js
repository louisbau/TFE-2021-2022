const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, ReportMessage } = require("../models");
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

router.post("/message", verifyJWT, async (req, res) => {
    try {
        const { id, reason } = req.body;
        await ReportMessage.create(({
            reason: reason,
            MessageId : id
        }))
        
        res.json("success report")
    }
    catch (error) {
        res.json(error)
    }

    
});

module.exports = router;