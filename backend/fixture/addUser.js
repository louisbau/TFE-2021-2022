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
            console.log(chat[a])
            const usid = await User.findByPk(parseInt(chat[a].id));
            const chatid = await ChatRoom.findByPk(parseInt(fixtureChat.Chatroom[i].id));
            ChatRoomUser.create(({
                ChatRoomId: chatid.id,
                UserId: usid.id
            }))
        }
    }
    for (i in fixtureMessages.Messages) {
        const chatid = await ChatRoom.findByPk(parseInt(fixtureMessages.Messages[i].id));
        const mess = fixtureMessages.Messages[i].messages
        for (a in mess) {
            const usid = await User.findByPk(parseInt(mess[a].user.id));
            Message.create(({
                content: mess[a].content,
                ChatRoomId: chatid.id,
                UserId: usid.id,
                createdAt: mess[a].createdAt
            }))
        }
        
    }

    
    /*
    const chat = await ChatRoom.findByPk(4);
    console.log(chat)
    const us1 = await User.findByPk(1);
    console.log(chat)
    const us2 = await User.findByPk(2);
    console.log(chat)
    ChatRoomUser.create(({
        ChatRoomId: chat.id,
        UserId: us1.id
    }))
    ChatRoomUser.create(({
        ChatRoomId: chat.id,
        UserId: us2.id
    }))

    Message.create(({
        content: 'hello',
        ChatRoomId: chat.id,
        UserId: us1.id
    }))
    */

}

module.exports = DefaultUser