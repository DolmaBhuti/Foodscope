require("dotenv").config();
var HTTP_PORT = process.env.PORT || 4000;
const path = require("path");
const exphbs = require("express-handlebars");

const express = require("express");
const productRoutes = require("./BackEnd/routes");

//express app
var app = express();

//middleware
app.use(express.static(__dirname + "/static")); //only call the file name or images in "views" folder" (/images/ss.jpg)

//any request that cones in, it looks if there is any body in the request and if it does, then it passes it and attaches it to the request object so tha twe can access it in the request handler
app.use(express.json()); //https://expressjs.com/en/api.html
//routes
app.use("/api/products", productRoutes); //only fire the routes at a specific path

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
  // res.send("Hello World<br /><a href='/on-the-menu'>On The Menu</a>");
});

//get products
app.get("/on-the-menu", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/OnTheMenu.html"));
  console.log("Hello from on-the-menu");
  // res.send("Hello World<br />from On The Menu page");
});

//sign up user
app.get("/registration", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/Registration.html"));
  console.log("Hello from registration");
});

//log in user
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/Login.html"));
  console.log("Hello from login");
});

//listen for requests
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});

// app.use(express.static(__dirname + "/views"));

// app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
// app.set('view engine', '.hbs');
