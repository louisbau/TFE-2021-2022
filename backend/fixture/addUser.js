const { User, ChatRoom, Message, ChatRoomUser, Friend, FriendShip } = require("../models");

const bcrypt = require("bcrypt");
const fixtureUser = require("./fixtureUser");
const fixtureChat = require("./fixtureChatroom");
const fixtureMessages = require("./fixtureMessages");
const rounds = 12;


async function  DefaultUser () {
    for (i in fixtureUser.Userse) {
        const hash = await bcrypt.hash(fixtureUser.Userse[i].name, rounds)
        await User.create(({
            email: fixtureUser.Userse[i].name,
            name: fixtureUser.Userse[i].name,
            password: hash,
            imageUri: fixtureUser.Userse[i].imageUri
        }))
    }
    for (i in fixtureChat.Chatroom) {
        if (fixtureChat.Chatroom[i].users.length > 2) {
            const image = fixtureChat.Chatroom[i].imageUri ? fixtureChat.Chatroom[i].imageUri : null
            const name = fixtureChat.Chatroom[i].name ? fixtureChat.Chatroom[i].name : 'Group'
            await ChatRoom.create(({
                isGroupe: true,
                name : name,
                imageUri: image
            }))
        }
        else {
            await ChatRoom.create()
        }
         
    }
    
    for (i in fixtureChat.Chatroom) {
        const chat = fixtureChat.Chatroom[i].users
        
        for (a in chat) {
            const usid = await User.findByPk(parseInt(chat[a].id));
            const chatid = await ChatRoom.findByPk(parseInt(fixtureChat.Chatroom[i].id));
            await ChatRoomUser.create(({
                ChatRoomId: chatid.id,
                UserId: usid.id
            }))
            if (a == 0) {
                await ChatRoom.update({creator: usid.id}, {
                    where : {id : chatid.id}
                })
            }
            if (chatid.id !== 1){
                await Message.create(({
                    content: 'first' + a,
                    ChatRoomId: chatid.id,
                    UserId: usid.id,
                }))
            }
            
        }
    }

      
    const chatid = await ChatRoom.findByPk(parseInt(fixtureMessages.Messages[0].id));
    const mess = fixtureMessages.Messages[0].messages
    for (a in mess) {
        const usid = await User.findByPk(parseInt(mess[a].user.id));
        await Message.create(({
            content: mess[a].content,
            ChatRoomId: chatid.id,
            UserId: usid.id,
            createdAt: mess[a].createdAt
        }))
    }
    

    const mess2  = await Message.findAll(
        {order: [['updatedAt', 'DESC']]}
    )
    for (i in mess2){
        await ChatRoom.update({lastMessageId : mess2[i].id}, {
            where : {id : mess2[i].ChatRoomId}
        })
    }

    const listUser = await User.findAll()
    for (i in listUser) {
        await Friend.create(({
            UserId: listUser[i].id
        }))
        
    }
    const listFriend = await Friend.findAll()
    for (i in listFriend) {
        if (i) {
            await FriendShip.create(({
                FriendId: 1,
                UserId: listUser[i].id
            }))
        }
        
    }
    

    
    
    
    
    
}

module.exports = DefaultUser