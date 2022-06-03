const express = require("express");
const router = express.Router();
const { Message, User, ChatRoomUser, ChatRoom, SubChatRoom } = require("../models");
const moment = require("moment");
const verifyJWT = require("./isAuth");
const { Op } = require("sequelize");

router.get("/ping", (req, res) => {
    try {
        res.status(200).json('pong')
    }
    catch (error) {
        res.json(error)
    }
    
});


router.get("/:id",verifyJWT, async (req, res) => {
    try {
        const listMessage = await Message.findAll(
            {
                where: {
                    [Op.and]: [
                        { SubChatRoomId: req.params.id},
                        { [Op.or]: [{ forUserId: req.id.UserId }, { forUserId: null }] }
                    ]
                }
            }
        )
        res.json(listMessage);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.get("/reference/:id",verifyJWT, async (req, res) => {
    try {
        const listMessage = await Message.findOne(
            {
                where: {id : req.params.id}
            }
        )
        res.json(listMessage);
    }
    catch (error) {
        res.json(error)
    }
    
});

router.patch("/renameMessage", verifyJWT, async (req, res) => {
    try {
        const { newmessage, id } = req.body;
    
        const group = await Message.update({content: newmessage}, {
            where : {id : id}
        })
        res.json(group)
    }
    catch (error) {
        res.json(error)
    }
    

    
});

router.delete("/deleteMessage", verifyJWT, async (req, res) => {
    try {
        const { id } = req.body;
    
        const group = await Message.destroy(({
            where : {id : id}
        }))
        
        res.json(group)
    }
    catch (error) {
        res.json(error)
    }
    

    
});


router.post("/",verifyJWT, async (req, res) => {
    try {
        const { content, image, audio, SubChatRoomId, UserChatRoomId, forUserId, isCrypted, reference } = req.body;
        await Message.create(({
            content: content,
            image: image,
            audio: audio,
            SubChatRoomId: SubChatRoomId,
            UserChatRoomId: UserChatRoomId,
            forUserId: forUserId,
            isCrypted: isCrypted,
            reference: reference,
            createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }))
        .then(async (req2) => {
            SubChatRoom.update({lastMessageId : req2.id}, {
                where : {id : req2.SubChatRoomId}
            })
            const listOfChatRoomUser = await Message.findAll(
                {
                    where: {
                        [Op.and]: [
                            { SubChatRoomId: SubChatRoomId},
                            { [Op.or]: [{ forUserId: req.id.UserId }, { forUserId: null }] }
                        ]
                    }
                }
            )
            res.json(listOfChatRoomUser);
            
        })
        .catch(err => {
            console.log(err);
            res.status(502).json({message: "error saving message"});
        });
    }
    catch (error) {
        res.json(error)
    }
    
    
});

module.exports = router;