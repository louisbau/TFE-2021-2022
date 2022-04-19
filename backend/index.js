const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();
require('dotenv').config();
const user = require("./routes/User");
const chatroomuser = require("./routes/ChatRoomUser");
const chatroom = require("./routes/ChatRoom");
const message = require("./routes/Message")
const DefaultUser = require("./fixture/addUser");


var corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", user);
app.use("/api/ChatRoomUser", chatroomuser);
app.use("/api/ChatRoom", chatroom);
app.use("/api/Message", message);
DefaultUser()


db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});



const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});