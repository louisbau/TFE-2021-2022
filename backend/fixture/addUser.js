const { User, ChatRoom, Message, ChatRoomUser } = require("../models");

const bcrypt = require("bcrypt");
const fixtureUser = require("./fixtureUser");
const fixtureChat = require("./fixtureChatroom");
const fixtureMessages = require("./fixtureMessages");
const rounds = 12;


async function  DefaultUser () {
    for (i in fixtureUser.Userse) {
        const hash = await bcrypt.hash(fixtureUser.Userse[i].name, rounds)
        User.create(({
            email: fixtureUser.Userse[i].name,
            name: fixtureUser.Userse[i].name,
            password: hash,
            imageUri: fixtureUser.Userse[i].imageUri
        }))
    }

    for (i in fixtureChat.Chatroom) {
        ChatRoom.create(({
            newMessages: parseInt(fixtureChat.Chatroom[i].lastMessage.id),
        }))  
    }
    
    for (i in fixtureChat.Chatroom) {
        const chat = fixtureChat.Chatroom[i].users
        
        for (a in chat) {
            const usid = await User.findByPk(parseInt(chat[a].id));
            const chatid = await ChatRoom.findByPk(parseInt(fixtureChat.Chatroom[i].id));
            ChatRoomUser.create(({
                ChatRoomId: chatid.id,
                UserId: usid.id
            }))
            if (chatid.id !== 1){
                Message.create(({
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
        Message.create(({
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
        ChatRoom.update({lastMessageId : mess2[i].id}, {
            where : {id : mess2[i].ChatRoomId}
        })
    }
    
}

module.exports = DefaultUser