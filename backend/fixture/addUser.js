const { User, ChatRoom, Message, ChatRoomUser, Friend, FriendShip, SubChatRoom, UserChatRoom } = require("../models");

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
            const chat = await ChatRoom.create(({
                isGroupe: true,
                name : name,
                imageUri: image
            }))
            await SubChatRoom.create(({
                name : 'Générale',
                ChatRoomId : chat.id
            }))
        }
        else {
            const chat = await ChatRoom.create()
            await SubChatRoom.create(({
                ChatRoomId : chat.id
            }))
        }
         
    }

    
    for (i in fixtureChat.Chatroom) {
        const chat = fixtureChat.Chatroom[i].users
        
        for (a in chat) {
            
            const chatid = await SubChatRoom.findByPk(parseInt(fixtureChat.Chatroom[i].id));
            
            console.log(chatid.id)
            console.log(chat[a].id)
            const us = await UserChatRoom.create(({
                UserId: chat[a].id,
                ChatRoomId: chatid.id,
                pseudo: chat[a].name
            }))
            
            await ChatRoomUser.create(({
                SubChatRoomId: chatid.id,
                UserChatRoomId: us.id
            }))
            if (a == 0) {
                await ChatRoom.update({creator: us.id}, {
                    where : {id : chatid.id}
                })
                await UserChatRoom.update({role: "admin"}, {
                    where : {ChatRoomId : chatid.id}
                })
                
                await SubChatRoom.update({creator: us.id}, {
                    where : {ChatRoomId : chatid.id}
                })
            }
            if (chatid.id !== 1){
                await Message.create(({
                    content: 'first' + a,
                    SubChatRoomId: chatid.id,
                    UserChatRoomId: us.id,
                }))
            }
            
        }
    }

      
    const chatid = await SubChatRoom.findByPk(parseInt(fixtureMessages.Messages[0].id));
    const mess = fixtureMessages.Messages[0].messages
    for (a in mess) {
        const usid = await User.findByPk(parseInt(mess[a].user.id));
        await Message.create(({
            content: mess[a].content,
            SubChatRoomId: chatid.id,
            UserChatRoomId: usid.id,
            createdAt: mess[a].createdAt
        }))
    }
    

    const mess2  = await Message.findAll(
        {order: [['updatedAt', 'DESC']]}
    )
    
    for (i in mess2){
        
        await SubChatRoom.update({lastMessageId : mess2[i].id}, {
            where : {id : mess2[i].SubChatRoomId}
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
        if (listUser[i].id !== 1) {
            await FriendShip.create(({
                FriendId: 1,
                UserId: listUser[i].id
            }))
        }
        
    }
    
    

    
    
    
    
    
}

module.exports = DefaultUser