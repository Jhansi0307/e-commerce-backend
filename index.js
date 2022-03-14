const express = require("express");
const mongo = require("./connect");
const cors = require('cors');
require('dotenv').config()
const { Home, register, login } = require("./modules/module");

const app = express();
app.use(cors())
app.use(express.json())
mongo.connect();




//REGISTER
app.post('/register',register);

//LOGIN
app.post('/login',login);
app.get('/',Home)

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Started at 4000");
});
