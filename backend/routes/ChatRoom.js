const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");

router.get("/test",verifyJWT, async (req, res) => {
    try {
        index = []
        table = []
        dic = {}
        const listChatRoomIndex = await ChatRoomUser.findAll({where: {UserId: req.id.UserId}});
        
        for (i in listChatRoomIndex) {
            index.push(listChatRoomIndex [i].ChatRoomId)
        }
        const listChatRoom = await ChatRoom.findAll({where: {id: index}});
        
        for (i in listChatRoom) {
            dic = listChatRoom[i].dataValues
            const UserMessage = await User.findOne({
                include: {
                    model: Message,
                    where : {id: dic["lastMessageId"]}
                },
                attributes: { exclude: ['password', 'email'] }
            })
            dic["lastMessage"] = UserMessage
            const listUser = await User.findAll({
                include: {
                    model: ChatRoomUser, 
                    where: {ChatRoomId:dic.id}
                },
                attributes: { exclude: ['password', 'email'] }
            })
            dic["Users"] = listUser
            
            table.push(dic)
        }
        
        
        res.json(table);
    } catch (error) {
        res.status(400).send(error)
    }
    
});

router.get("/list", verifyJWT, async (req, res) => {
    try {
        const listOfChatRoom = await ChatRoomUser.findAll({where: {UserId:req.id.UserId}});
        list = [];
        for (i in listOfChatRoom) {
            const listOfChatRoom3 = await ChatRoom.findAll({
                include:[
                    {
                        model: ChatRoomUser, where: {ChatRoomId:listOfChatRoom[i].ChatRoomId}
                    }, {
                        model: Message, where: {ChatRoomId:listOfChatRoom[i].ChatRoomId}
                    }
                ]
            });
            list.push(listOfChatRoom3)
        }
        res.json(list);
    } catch (error) {
        res.status(400).send(error)
    }
    
});

router.get("/list/Group",verifyJWT, async (req, res) => {
    try {
        const listOfChatRoom = await ChatRoom.findAll({
            where: {isGroupe : 1}
        });
        res.json(listOfChatRoom)
    } catch (error) {
        res.status(400).json(error)
    }
});

router.get("/list/:id", async (req, res) => {
    try {
        const listOfChatRoom = await ChatRoom.findAll({
            include: {
                model: ChatRoomUser,
                
            },
            group:"id"
            
        });
        res.json(listOfChatRoom)
    } catch (error) {
        res.status(400).json(error)
    }
});

router.get("/:id",verifyJWT, async (req, res) => {
    try {
        const listOfChatRoom = await ChatRoom.findOne({where:{id:req.params.id}});
        res.json(listOfChatRoom)
    } catch (error) {
        res.status(400).json(error)
    }
});

module.exports = router;