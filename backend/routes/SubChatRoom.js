const express = require("express");
const router = express.Router();
const { ChatRoomUser, User, Message, ChatRoom, UserChatRoom, SubChatRoom } = require("../models");
const verifyJWT = require('./isAuth')
const { Op } = require("sequelize");


router.post("/list",verifyJWT, async (req, res) => {
    const { subChatRoomId, userChatRoomId } = req.body;
    const chatroomID = await SubChatRoom.findOne(({where : {id : subChatRoomId}}));
    const listofallUser = await UserChatRoom.findAll(({where : {ChatRoomId : chatroomID.id}}));
    index = []
    for (i in listofallUser) {
        index.push(listofallUser[i].UserId)
    }
    const list = await User.findAll(({where : {id : index}}));
    res.json(list);
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

router.patch("/renameSub", verifyJWT, async (req, res) => {
    const { subname, subnameid } = req.body;
    
    await SubChatRoom.update({name: subname}, {
        where : {id : subnameid}
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
            { id: subnameid },
            { isGroupe: true }
          ]
        }
    });

    res.json(ChatRoomGroup[0])

    
});

router.delete("/deleteSubRoom", verifyJWT, async (req, res) => {
    const { id } = req.body;

    const listSub = await SubChatRoom.findAll(({
        where: {ChatRoomId: id}
    }))
    const listUser = await UserChatRoom.findAll(({
        where: {ChatRoomId: id}
    }))
    for (i in listSub) {
        await Message.destroy(({
            where : {SubChatRoomId : listSub[i].id}
        }))
    }
    for (i in listUser) {
        await ChatRoomUser.destroy(({
            where : {UserChatRoomId : listUser[i].id}
        }))
    }
    
    await UserChatRoom.destroy(({
        where : {ChatRoomId : id}
    }))
    await SubChatRoom.destroy(({
        where : {ChatRoomId : id}
    }))
    res.json("succes")

    
})

module.exports = router;