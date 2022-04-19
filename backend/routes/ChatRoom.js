const express = require("express");
const router = express.Router();
const { ChatRoom } = require("../models");

router.get("/list", async (req, res) => {
    const listOfChatRoom = await ChatRoom.findAll();
    res.json(listOfChatRoom);
});


module.exports = router;