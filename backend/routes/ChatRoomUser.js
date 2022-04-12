const express = require("express");
const router = express.Router();
const { ChatRoomUser } = require("../models");

router.get("/list", async (req, res) => {
    const listOfChatRoomUser = await ChatRoomUser.findOne();
    res.json(listOfChatRoomUser);
});

module.exports = router;