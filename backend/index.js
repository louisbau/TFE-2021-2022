const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();
require('dotenv').config();
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



const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});