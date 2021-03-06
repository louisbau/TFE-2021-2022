const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom } = require("../models");
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


router.get("/:id",verifyJWT, async (req, res) => {
    try {
        const OneUserChatRoom = await UserChatRoom.findOne({ 
            where: {id: req.params.id}
        });
        res.json(OneUserChatRoom);
    }
    catch (error) {
        res.json(error)
    }
    
});


router.post("/addUserGroup", verifyJWT, async (req, res) => {
    try {
        const { name, ChatRoomId } = req.body;
        const IsUser = await User.findOne(({
            where : {name : name}
        }));

        const UserChatRoom1 = await UserChatRoom.create(({
            pseudo: name,
            ChatRoomId: ChatRoomId,
            UserId: IsUser.id
        }))
        
        const allSubChatRoom = await SubChatRoom.findAll(({where : {ChatRoomId: ChatRoomId}}))
        for (i in allSubChatRoom) {
            await ChatRoomUser.create(({
                SubChatRoomId: allSubChatRoom[i].id,
                UserChatRoomId: UserChatRoom1.id
            }))
        }

        const ChatRoomGroup = await ChatRoom.findAll({
            include: [
                {
                    model: SubChatRoom,
                    right: true, // will create a right join
                },
                {
                    model: UserChatRoom,
                    right: true, // will create a right join
                }
            ],
            where: {
                [Op.and]: [
                    { id: ChatRoomId },
                    { isGroupe: true }
                ]
            }
        });

        res.json(ChatRoomGroup[0])
    }
    catch (error) {
        res.json(error)
    }
    

    
});

router.patch("/renameUserChat", verifyJWT, async (req, res) => {
    try {
        const { userchatname, userchatid } = req.body;
    
        const group = await UserChatRoom.update({pseudo: userchatname}, {
            where : {id : userchatid}
        })
        
        


        const ChatRoomGroup = await ChatRoom.findAll({
            include: [
                {
                    model: SubChatRoom,
                    right: true, // will create a right join
                },
                {
                    model: UserChatRoom,
                    right: true, // will create a right join
                }
            ],
            where: {
                [Op.and]: [
                    { id: group.ChatRoomId },
                    { isGroupe: true }
                ]
            }
        });

        res.json(ChatRoomGroup[0])
    }
    catch (error) {
        res.json(error)
    }
    

    
});

router.delete("/deleteUserChat", verifyJWT, async (req, res) => {
    try {
        const { id } = req.body;

    
        await Message.destroy(({
            where : {UserChatRoomId : id}
        }))

        await ChatRoomUser.destroy(({
            where : {UserChatRoomId : id}
        }))
        
        
        
        await UserChatRoom.destroy(({
            where : {id : id}
        }))
        
        


        res.json("succes")
    }
    catch (error) {
        res.json(error)
    }
    

    
});


module.exports = router;