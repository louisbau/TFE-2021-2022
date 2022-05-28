const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom,SubChatRoom, FriendShip, Friend } = require("../models");
const verifyJWT = require('./isAuth')
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");


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


router.post("/newChat", verifyJWT, async (req, res) => {
    const { subname, ChatRoomId } = req.body;
    console.log(subname, ChatRoomId, req.id.UserId)
    const userCreator = await UserChatRoom.findOne(({
        where: {
            [Op.and]: [
                { ChatRoomId: ChatRoomId},
                { UserId: req.id.UserId }
            ]
        }
    }))
    const subchat = await SubChatRoom.create(({
        name: subname,
        ChatRoomId : ChatRoomId,
        creator: userCreator.id
    }))
    const allUserChatRoom = await UserChatRoom.findAll(({where : {ChatRoomId: ChatRoomId}}))
    for (i in allUserChatRoom) {
        await ChatRoomUser.create(({
            SubChatRoomId: subchat.id,
            UserChatRoomId: allUserChatRoom[i].id
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

    
});


router.post("/newGroup", verifyJWT, async (req, res) => {
    const { name, subname } = req.body;
    const createChatRoom = await ChatRoom.create(({
        isGroupe: true,
        name: name,
    }))

    const creator = await User.findOne(({where : {id : req.id.UserId}}))
    const UserChatRoom1 = await UserChatRoom.create(({
        pseudo: creator.name,
        role: "admin",
        ChatRoomId: createChatRoom.id,
        UserId: creator.id
    }))

    await ChatRoom.update({creator:  UserChatRoom1.id}, {
        where : {id : createChatRoom.id}
    })

    const subchat = await SubChatRoom.create(({
        name: subname,
        ChatRoomId : createChatRoom.id,
        creator:  UserChatRoom1.id
    }))

    await ChatRoomUser.create(({
        SubChatRoomId: subchat.id,
        UserChatRoomId: UserChatRoom1.id
    }))

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
            { id: createChatRoom.id },
            { isGroupe: true }
          ]
        }
    });

    res.json(ChatRoomGroup[0])

    
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
                console.log(req.id.UserId)
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







router.patch("/renameGroup", verifyJWT, async (req, res) => {
    const { groupname, groupid } = req.body;
    
    const group = await ChatRoom.update({name: groupname}, {
        where : {id : groupid}
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
            { id: group.id },
            { isGroupe: true }
          ]
        }
    });

    res.json(ChatRoomGroup[0])

    
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