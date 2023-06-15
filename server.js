require("dotenv").config();
const path = require("path");
const exphbs = require("express-handlebars");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
var HTTP_PORT = process.env.PORT;

//express app
var app = express();

//middleware
app.use(express.static(__dirname + "/static")); //only call the file name or images in "views" folder" (/images/ss.jpg)

/************************
 * express-session   ****
 ************************/
app.use(
  session({
    //pass session into express
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  //res.locals.user is a global handlebars variable
  //every single handlesbars file can access that user variable
  // {{#if user}}
  //  Hello, {{user.firstName}}
  res.locals.user = req.session.user;
  next();
});

// Parse application/x-www-form-urlencoded (form data)
app.use(express.urlencoded({ extended: false }));

//any request that cones in, it looks if there is any body in the request and if it does, then it passes it and attaches it to the request object so tha twe can access it in the request handler
app.use(express.json()); //https://expressjs.com/en/api.html
//important to send data back

/************************
 * HANDLEBARS CONFIG ****
 ************************/
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
    },
  })
);
app.set("view engine", ".hbs");

/************************
 * Database config      *
 ************************/
// Set up and connect to MongoDB
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
/************************
 * EMAIL CONFIGURATION  *
 ************************/
// const sgMail = require("@sendgrid/mail");
// const nodeMailer = require("nodemailer");

//set up send grid api
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//registration email message
// const html = "<strong>and easy to do anywhere, even with Node.js</strong>";
// async function main() {
//   //specify information about the mail server that youre going to be sending emails from
//   nodeMailer.createTransport({});
// }
// const message = {
//   to: "", //dynamiclly change to clients
//   from: "dbhuti95@gmail.com",
//   subject: "Sending with Twilio SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

/************************
 * ROUTES ***************
 ************************/

//routes -> controller -> model
const productRoutes = require("./routes/productRoutes");
const loginRoutes = require("./routes/loginRoutes");
const loginController = require("./controllers/loginController");
app.use("/api", productRoutes); //only fire the routes at a specific path
app.use("/", loginRoutes);

//listen for requests
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});
