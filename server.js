const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");

const { Login, Chat } = require("./mongoose");

const app = express();

// allow the app to use cookieparser
app.use(helmet());

// allow the app to use cookieparser
app.use(cookieparser());

// allow the express server to process POST request rendered by the ejs files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use("/images", express.static("images"));
app.set("view engine", ".ejs");



// a port number to expose the server
const PORT = process.env.PORT || 5000;



app.get("/", (req, res, next) => {
  // check if user is logged in, by checking cookie
  let username = req.cookies.username;
  if (username) {
    res.redirect("/chat");
    next();
  }
  // render the home page
  return res.render("register", {
    username,
  });
});

app.get("/login", (req, res) => {
  //   check if there is a msg query
  let bad_auth = req.query.msg ? true : false;

  //   if there exists, send the error.
  if (bad_auth) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  } else {
    //   else just render the login
    return res.render("login");
  }
});

app.post("/register", async (req, res, next) => {
  let data = new Login(req.body);
  let result = await data.save();
  console.log(result);
  res.redirect("/login");
  next();
});

app.post("/process_login", async (req, res, next) => {
  // get the data
  try {

  } catch (error) {

  }
  let { username, password } = req.body;
  try {
     let data = await Login.findOne({ username: username });
  console.log(data)
  let userdetails = {
    username: data.username,
    password: data.password,
  };

  // check if user is entering correct credentials
if(
  username === userdetails["username"] &&
  password === userdetails["password"]) {
    // saving the data to the cookies
    res.cookie("username", username);
    // redirect
  return res.redirect("/chat");
  next()
} else {
  return res.redirect("/login?msg=fail");
  next();
  }
   
  } catch (error) {
    res.redirect('/login')
    next()
    console.log(error)
  }
   

});

app.get("/logout", (req, res) => {
  // clear the cookie
  res.clearCookie("username");
  // redirect to login
  return res.redirect("/login");
});

//chat section

const isloggedin = (req, res, next) => {
  let username = req.cookies.username;
  if (username) {
    next();
  } else {
    res.redirect("/login");
    next();
  }
};
app.get("/chat", isloggedin, async (req, res) => {
  let username = req.cookies.username;
  let data = await Chat.find();
  res.render("chat", { data, username });
});


const http = require("http").createServer(app);
const io = require("socket.io")(http);
var cookie = require("cookie");



const date = new Date();

const timeZone = "Asia/Kolkata";
const currentDate = new Intl.DateTimeFormat("en-US", {
  timeStyle: "medium",
  dateStyle: "medium",
  timeZone,
});
const dateandtime = currentDate.format(date);

io.on("connection", (socket) => {
  console.log("Connected...");
  const ck = cookie.parse(socket.request.headers.cookie);


  socket.on("send", async (message) => {
    try {
      let chatdata = {
        name: ck.username,
        message: message,
        Date: JSON.stringify(dateandtime),
      };

      let data = new Chat(chatdata);

      let result = await data.save();

      socket.broadcast.emit("receive", chatdata);
    } catch (error) {
      console.log(error)
    }
    
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



