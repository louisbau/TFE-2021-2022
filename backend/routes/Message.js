const express = require("express");
const router = express.Router();
const { Message, User, ChatRoomUser, ChatRoom, SubChatRoom } = require("../models");
const moment = require("moment");
const verifyJWT = require("./isAuth");



router.get("/:id",verifyJWT, async (req, res) => {
    const listMessage = await Message.findAll(
        {
            where: {
                SubChatRoomId: req.params.id
            }
        }
    )
    res.json(listMessage);
});

router.patch("/renameMessage", verifyJWT, async (req, res) => {
    const { newmessage, id } = req.body;
    
    const group = await Message.update({content: newmessage}, {
        where : {id : id}
    })
    
    


    res.json(group)

    
});

router.patch("/deleteMessage", verifyJWT, async (req, res) => {
    const { id } = req.body;
    
    const group = await Message.destroy(({
        where : {id : id}
    }))
    
    


    res.json(group)

    
});


router.post("/",verifyJWT, async (req, res) => {
    const { content, image, audio, SubChatRoomId, UserChatRoomId } = req.body;
    await Message.create(({
        content: content,
        image: image,
        audio: audio,
        SubChatRoomId: SubChatRoomId,
        UserChatRoomId: UserChatRoomId,
        createdAt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }))
    .then(async (req2) => {
        SubChatRoom.update({lastMessageId : req2.id}, {
            where : {id : req2.SubChatRoomId}
        })
        const listOfChatRoomUser = await Message.findAll(
            {
                where: {
                    SubChatRoomId: SubChatRoomId
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