const express = require("express");
const cors = require("cors");
const db = require("./models");
const app = express();
require('dotenv').config();

var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});



const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});