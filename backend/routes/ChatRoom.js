const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");

router.get("/ping", (req, res) => {
    res.status(200).json('pong')
});

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





router.get("/listPrivateConv",verifyJWT, async (req, res) => {
    try {
        index = []
        table = []
        dic = {}
        
        const listUserChatRooms = await UserChatRoom.findAll({where: {UserId: req.id.UserId}})

        for (i in listUserChatRooms) {
            index.push(listUserChatRooms[i].ChatRoomId)
        }
        
        
        const listChatRoomPrivate = await ChatRoom.findAll({
            include: {
                model: SubChatRoom,
                right: true, // will create a right join
            },
            where: {
              [Op.and]: [
                { id: index },
                { isGroupe: false }
              ]
            }
        });

        for (i in listChatRoomPrivate) {
            dic = listChatRoomPrivate[i].dataValues
            
            const UserMessage = await UserChatRoom.findOne({
                include: {
                    model: Message,
                    where : {id: dic["SubChatRooms"][0]["lastMessageId"]}
                }
            })
            
            dic["SubChatRooms"] = dic["SubChatRooms"][0]
            const listUser = await UserChatRoom.findAll({
                include: {
                    model: ChatRoomUser, 
                    where: {SubChatRoomId:dic["SubChatRooms"].id}
                },
                
            })
            
            listUserCopy = listUser.map(x => x.dataValues);
            for (a in listUserCopy) {
                let img = await User.findOne({
                    where : {id : listUserCopy[a].UserId}
                })
                img = img.dataValues
                listUserCopy[a]["imageUri"] = img.imageUri
            }
            
            dic["Users"] = listUserCopy 
            if (UserMessage) {
                dic["lastMessage"] = UserMessage.dataValues
                dic["lastMessage"]["Messages"] = dic["lastMessage"]["Messages"][0]
            }           
            table.push(dic)
        }

        res.json(table);
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    
});

router.get("/listGroup",verifyJWT, async (req, res) => {
    try {
        index = []
        table = []
        dic = {}
        
        const listUserChatRooms = await UserChatRoom.findAll({where: {UserId: req.id.UserId}})

        for (i in listUserChatRooms) {
            index.push(listUserChatRooms[i].ChatRoomId)
        }
        
        
        const listChatRoomPrivate = await ChatRoom.findAll({
            include: {
                model: SubChatRoom,
                right: true, // will create a right join
            },
            where: {
              [Op.and]: [
                { id: index },
                { isGroupe: true }
              ]
            }
        });

        for (i in listChatRoomPrivate) {
            dic = listChatRoomPrivate[i].dataValues
            
            
            dic["SubChatRooms"] = dic["SubChatRooms"]
            const listUser = await UserChatRoom.findAll({
                where : {ChatRoomId : dic.id},
                include: {
                    model: ChatRoomUser
                },
                
            })
            listUserCopy = listUser.map(x => x.dataValues);
            dic["Users"] = listUserCopy 
            
            table.push(dic)
        }

        res.json(table);
    } catch (error) {
        console.log(error)
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

router.post("/addPics",verifyJWT, async (req, res) => {
    const { pics, id } = req.body;
    const userResult = await ChatRoom.update({imageUri: pics}, {
        where : {id : id}
    })
    
    res.json(userResult);
});


router.patch("/renameGroup", verifyJWT, async (req, res) => {
    const { groupname, groupid } = req.body;
    
    await ChatRoom.update({name: groupname}, {
        where : {id : groupid}
    })
    console.log(groupname, groupid)
    


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
            { id: groupid },
            { isGroupe: true }
          ]
        }
    });

    res.json(ChatRoomGroup[0])

    
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

router.delete("/deleteChatRoom", verifyJWT, async (req, res) => {
    const { id } = req.body;

    
    await Message.destroy(({
        where : {SubChatRoomId : id}
    }))

    await ChatRoomUser.destroy(({
        where : {SubChatRoomId : id}
    }))
    
    
    
    await SubChatRoom.destroy(({
        where : {id : id}
    }))
    
    


    res.json("succes")

    
});

module.exports = router;