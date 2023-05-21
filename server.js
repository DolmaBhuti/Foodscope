const express = require("express");
const exphbs = require("express-handlebars");
require("dotenv").config();
const path = require("path");
var app = express();
var HTTP_PORT = process.env.PORT || 4000;

// app.use(express.static(__dirname + "/static"));
// app.use(express.static(__dirname + "/views"));

// app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
// app.set('view engine', '.hbs');

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/index.html"));
  res.send("Hello World<br /><a href='/on-the-menu'>On The Menu</a>");
});

app.get("/on-the-menu", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/OnTheMenu.html"));
  console.log("Hello from on-the-menu");
  // res.send("Hello World<br />from On The Menu page");
});

app.get("/registration", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/Registration.html"));

  console.log("Hello from registration");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/Login.html"));
  console.log("Hello from login");
});
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});
