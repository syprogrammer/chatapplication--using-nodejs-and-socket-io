const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;
mongoose.connect(process.env.SECRET_KEY);

const LoginSchema = new mongoose.Schema({
  username: String,
  password: {
    type: Schema.Types.Mixed,
    required: true,
  },
});
const chatSchema = new mongoose.Schema({
  name: String,
   message: {

    type: String,
    required: true,
  },
  Date:{type: String, default: Date.now},
});


const Login = mongoose.model("Loginmodel", LoginSchema);
const Chat = mongoose.model("chats", chatSchema);
module.exports = { Chat, Login };
