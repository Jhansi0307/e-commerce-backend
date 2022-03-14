const mongo = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports.Home = async (req, res) => {
  res.send("❤️Hey Buddy Welcome to Shopping ❤️🥳");
};

// REGISTER
module.exports.register = async (req, res) => {
  const user = await mongo.db
    .collection("users")
    .findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ msg: "EmailID already exists" });
  } else {
    //encrypt
    const salt = await bcrypt.genSalt(5);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    var data = await mongo.db.collection("users").insertOne(req.body);
    return res.send(data);
  }
};

// LOGIN
module.exports.login = async (req, res, next) => {
  const user = await mongo.db
    .collection("users")
    .findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ msg: "EmailID is not Correct" });

  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (!isValid) return res.status(400).send({ msg: "Incorrect Password" });

  //Generate token
  const token = jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRY_TIME,
  });
  res.send(token);
};
