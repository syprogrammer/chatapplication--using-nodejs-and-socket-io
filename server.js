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
const PORT = process.env.PORT || 3000;



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

app.post("/process_login", async (req, res) => {
  // get the data
  let { username, password } = req.body;

    let data = await Login.findOne({ username: username });
    // console.log(data)
  let userdetails = {
    username: data.username,
    password: data.password,
  };

  // check if user is entering correct credentials
  if (
    username === userdetails["username"] &&
    password === userdetails["password"]
  ) {
    // saving the data to the cookies
    res.cookie("username", username);
    // redirect
    return res.redirect("/chat");
  } else {
    // redirect with a fail msg
    return res.redirect("/login?msg=fail");
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

app.post("/chat", isloggedin, async (req, res, next) => {
  let username = req.cookies.username;
  let chatdata = {
    name: username,
    message: req.body.message,
  };
  console.log("chatdat is ", chatdata);
  let data = new Chat(chatdata);

  let result = await data.save();

  console.log(result);

  res.redirect("/chat");
  next();
});

app.listen(PORT);
