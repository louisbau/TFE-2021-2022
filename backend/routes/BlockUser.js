const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom, BlockUser } = require("../models");
const verifyJWT = require("./isAuth");



router.post("/block", verifyJWT, async (req, res) => {
    try {
        const { id } = req.body;


        await BlockUser.create(({
            UserId: req.id.UserId,
            userIdBlock: id
        }))

        res.json("success blocking")
    }
    catch (error) {
        res.json(error)
    }
    

    
});

module.exports = router;