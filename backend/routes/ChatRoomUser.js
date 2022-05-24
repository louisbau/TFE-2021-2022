const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom,SubChatRoom } = require("../models");
const verifyJWT = require('./isAuth')
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

router.post("/newChatRoom/", async (req, res) => {
    const { user } = req.body;
    const users = await sequelize.query(
        "select distinct a.*, b.* from chatroomusers as a join chatroomusers as b on a.ChatRoomId = b.ChatRoomId join chatrooms as c on b.ChatRoomId = c.id where (a.UserId = :userA and b.UserId = :userB) and c.isGroupe = False",
        { 
            nest: true,
            replacements : { userA: 3, userB: 1},
            type: QueryTypes.SELECT 
        }
    );
    
    console.log(users)
    res.json(users);
});

router.post("/newConv",verifyJWT, async (req, res) => {
    const { name } = req.body;
    const IsUser = await User.findOne(({
        where : {name : name}
    }));
    index = []
    if (IsUser) {
        const IsConv = await UserChatRoom.findAll(({
            where : {UserId : IsUser.id}
        }));
        if (IsConv) {
            for (i in IsConv) {
                index.push(IsConv[i].ChatRoomId)
            }
            const listChatRoomPrivate = await ChatRoom.findAll({
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
                    { id: index },
                    { isGroupe: false }
                  ]
                }
            });
            let isConv = true
            for (i in listChatRoomPrivate) {
                if (listChatRoomPrivate[i].UserChatRooms.find((x)=> x.UserId === req.id.UserId)) {
                    res.json(listChatRoomPrivate[i])
                    isConv = false
                    break
                }
            }
            if (isConv) {
                const createChatRoom = await ChatRoom.create(({
                    isGroupe: false
                }))
                const creator = await User.findOne(({where : {id : req.id.UserId}}))
                const UserChatRoom1= await UserChatRoom.create(({
                    pseudo: creator.name,
                    role: "admin",
                    ChatRoomId: createChatRoom.id,
                    UserId: req.id.UserId
                }))
                await ChatRoom.update({creator:  UserChatRoom1.id}, {
                    where : {id : createChatRoom.id}
                })
                
                const UserChatRoom2 = await UserChatRoom.create(({
                    pseudo: name,
                    ChatRoomId: createChatRoom.id,
                    UserId: IsUser.id
                }))
                const subchat = await SubChatRoom.create(({
                    ChatRoomId : createChatRoom.id,
                    creator:  UserChatRoom1.id
                }))
                await ChatRoomUser.create(({
                    SubChatRoomId: subchat.id,
                    UserChatRoomId: UserChatRoom1.id
                }))
                await ChatRoomUser.create(({
                    SubChatRoomId: subchat.id,
                    UserChatRoomId: UserChatRoom2.id
                }))

                const mess = await Message.create(({
                    content: 'hello',
                    SubChatRoomId: subchat.id,
                    UserChatRoomId: UserChatRoom1.id,
                }))
                await SubChatRoom.update({lastMessageId:  mess.id}, {
                    where : {id : subchat.id}
                })

                const ChatRoomPrivate = await ChatRoom.findAll({
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
                        { id: createChatRoom.id },
                        { isGroupe: false }
                      ]
                    }
                });

                res.json(ChatRoomPrivate[0])
            }
        }
        else {
            res.json("error");
        }
    }
    else {
        res.json("no user");
    }

    
});

router.get("/list", async (req, res) => {
    const listOfChatRoomUser = await ChatRoomUser.findOne();
    res.json(listOfChatRoomUser);
});

router.get("/:id",verifyJWT, async (req, res) => {
    const listOfChatRoomUser = await User.findAll({ include: [{
        model: ChatRoomUser,
        where: {ChatRoomId: req.params.id}
       }, {
        model: Message,
        where: {ChatRoomId: req.params.id}
       }] 
    });
    res.json(listOfChatRoomUser);
});



module.exports = router;