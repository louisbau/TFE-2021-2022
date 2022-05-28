const express = require("express");
const cors = require("cors");
const db = require("./models");
const {User} = require("./models")
const app = express();
const server = require("http").createServer(app)
require('dotenv').config();
const io = require("socket.io")(server)
const user = require("./routes/User");
const chatroomuser = require("./routes/ChatRoomUser");
const chatroom = require("./routes/ChatRoom");
const message = require("./routes/Message")
const friends = require("./routes/Friends")
const friendships = require('./routes/FriendShip.js')
const userchatrooms = require('./routes/UserChatRoom.js')
const subchatrooms = require('./routes/SubChatRoom.js')
const DefaultUser = require("./fixture/addUser");


app.use(express.json());
var corsOptions = {
    origin: "*", 
    credential: true
};
app.use(cors(corsOptions));



app.use(express.urlencoded({ extended: true }));

app.use("/api", user);
app.use("/api/ChatRoomUser", chatroomuser);
app.use("/api/ChatRoom", chatroom);
app.use("/api/Message", message);
app.use("/api/Friends", friends);
app.use("/api/UserChatRoom", userchatrooms);
app.use("/api/FriendShips", friendships);
app.use("/api/SubChatRoom", subchatrooms);
DefaultUser()


db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});


io.on("connection", (socket) => {
  const index = {}
  console.log("----------CONNECTED-------------", socket.id);
  
  socket.on("Join", ({userId}) => {
    console.log('---------- JOIN -------------', userId)
    index[socket.id] = userId
    User.update({status: 'Disponible'}, {
      where : {id : userId}
    })
  })
  socket.on("Typing", ({subChatRoomId, userChatRoomId}) => {
    console.log('---------- Typing in ', subChatRoomId, userChatRoomId, ' in  -------------')
    io.sockets.in("sub-"+subChatRoomId).emit('connectToRoom', [subChatRoomId, userChatRoomId, true]);
  })
  socket.on("StopTyping", ({subChatRoomId, userChatRoomId}) => {
    console.log('---------- Stop Typing in ', subChatRoomId, userChatRoomId,' in  -------------')
    io.sockets.in("sub-"+subChatRoomId).emit('connectToRoom',  [subChatRoomId, userChatRoomId, false]);
  
  })
  socket.on("Room", ({subchatRoomid}) => {
    console.log('---------- Join the Room -------------')
    socket.join("sub-"+subchatRoomid);
  })
  socket.on("disconnect", () => {
    console.log('----------DISCONNECTED -------------', index[socket.id])
    if (index[socket.id]) {
      User.update({status: 'Absent'}, {
        where : {id : index[socket.id]}
      })
    }
    
  })
});


const PORT = process.env.PORT || 3001; 

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

