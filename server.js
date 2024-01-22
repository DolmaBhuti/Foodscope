require("dotenv").config();
const path = require("path");
const exphbs = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");
const loginRoutes = require("./routes/loginRoutes");
const cartRoutes = require("./routes/cartRoutes");

var HTTP_PORT = process.env.PORT;

//express app
var app = express();

//set up middlewares using app.use
app.use(express.static(__dirname + "/static")); //only call the file name or images in "views" folder" (/images/ss.jpg)

// Set up and connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the MongoDB database.");
  })
  .catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`);
  });

//express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),

    cookie: { secure: false }, //specifies the optionfor the session cookie (will create session middleware)
  })
);

app.use((req, res, next) => {
  //res.locals.user is a global handlebars variable
  //every single handlesbars file can access that user variable
  // {{#if user}}
  //  Hello, {{user.firstName}}
  res.locals.session = req.session;
  res.locals.user = req.session.user;
  res.locals.cart = req.session.cart;
  res.locals.subTotal = req.session.subTotal;
  next();
});

// Parse application/x-www-form-urlencoded (form data)
app.use(express.urlencoded({ extended: false }));

//any request that cones in, it looks if there is any body in the request and if it does, then it passes it and attaches it to the request object so that we can access it in the request handler
app.use(express.json()); //https://expressjs.com/en/api.html

//server needs to know how to handle HTML files that are formatted using handlebars
// Register handlebars as the rendering engine for views
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      if_equal: function (a, b, opts) {
        return a == b ? opts.fn(this) : opts.inverse(this);
      },
      if_cart: function (cart) {
        if (cart.length > 0) {
          req.session.cart_total = 0;
          return true;
        } else {
          return false;
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

//routes -> controller -> model

app.use("/api/products/", productRoutes); //only fire the routes at a specific path
app.use("/", loginRoutes);
app.use("/api/cart", cartRoutes);
//listen for requests
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});
