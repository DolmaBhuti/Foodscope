require("dotenv").config();
var HTTP_PORT = process.env.PORT;
const path = require("path");
const exphbs = require("express-handlebars");
const express = require("express");
// const sgMail = require("@sendgrid/mail");
// const nodeMailer = require("nodemailer");

//set up express-validator: it performs both validation and sanitization of our form data
const { body, validationResult } = require("express-validator");

//express app
var app = express();

//middleware
app.use(express.static(__dirname + "/static")); //only call the file name or images in "views" folder" (/images/ss.jpg)

//parse form data
app.use(express.urlencoded({ extended: false }));

//any request that cones in, it looks if there is any body in the request and if it does, then it passes it and attaches it to the request object so tha twe can access it in the request handler
app.use(express.json()); //https://expressjs.com/en/api.html
//important to send data back

/************************
 *       MODELS         *
 ************************/
const productsData = require("./models/ProductModel");

/************************
 * EMAIL CONFIGURATION  *
 ************************/
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
 * ROUTES ***************
 ************************/
const productRoutes = require("./routes/Products");

app.use("/api/products", productRoutes); //only fire the routes at a specific path

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/index.html"));
  // res.send("Hello World<br /><a href='/on-the-menu'>On The Menu</a>");
  res.render("index", { data: productsData.getTopCases });
});

//get products
app.get("/shop-products", (req, res) => {
  res.render("ShopProducts", {
    title: "Products",
    data: productsData.getAllCases,
  });
  console.log("Hello from shop products");
  // res.send("Hello World<br />from On The Menu page");
});

//sign up user form
app.get("/registration", (req, res) => {
  res.render("Registration", { title: "Register" });
  console.log("Hello from registration");
});

//welcome page for new user
function welcomeUser(req, res) {
  var context = req.dataProcessed; //registered user data
  res.render("welcome.hbs", { data: context });
}
app.get("/welcome", welcomeUser);

//registration form post
app.post(
  "/registration",
  [
    body("email")
      .notEmpty()
      .withMessage("* Email cannot be empty.")
      .isEmail()
      .withMessage("* Please include a valid email."),
    body("password")
      .notEmpty()
      .withMessage("* Password cannot be empty.")
      .isLength({ min: 6, max: 12 })
      .withMessage("Please enter a password with 6 to 12 characters")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,12}$/
      )
      .withMessage(
        "* Please enter a password that contains at least: one lowercase letter, uppercase letter, number and symbol "
      ),
    body("confirm_password")
      .notEmpty()
      .withMessage("* Enter confirmation password"),
    body("first_name")
      .notEmpty()
      .withMessage("* Enter First Name.")
      .isLength({ max: 50 }),
    body("last_name")
      .notEmpty()
      .withMessage("* Enter Last Name.")
      .isLength({ max: 50 }),
  ],
  (req, res, next) => {
    let errMessage = {}; //dipslay error message on hbs view
    const errors = validationResult(req);
    const user = ({ first_name, last_name, email, password, confirm_password } =
      req.body);
    if (!errors.isEmpty()) {
      const err = errors.errors; //array of objects
      for (let i = 0; i < err.length; i++) {
        if (err[i].path == "email") errMessage.email = err[i].msg;
        if (err[i].path == "password") errMessage.password = err[i].msg;
        if (err[i].path == "confirm_password")
          errMessage.confirm_password = err[i].msg;
        if (err[i].path == "first_name") errMessage.first_name = err[i].msg;
        if (err[i].path == "last_name") errMessage.last_name = err[i].msg;
      }
      console.log(errMessage);
      res.render("Registration", {
        title: "Registration",
        errMessage: errMessage,
        values: req.body,
      });
      //pass = false;
    } else {
      if (req.body.password === req.body.confirm_password) {
        //everything went well
        //send email welcome message.
        //change email client address
        message.to = req.body.email;
        sgMail
          .send(message)
          .then((res) => console.log("Email sent to " + message.to))
          .catch((error) => {
            console.log("Error sending email: " + error.message);

            if (error.response) {
              console.error(error.response.body);
            }
          });

        //send in data that the welcome page will use
        req.dataProcessed = user;
        return next();
      } else {
        errMessage.confirm_password = "* Passwords don't match.";
        res.render("Registration", {
          title: "Registration",
          errMessage: errMessage,
          values: req.body,
        });
      }
    }
  },
  welcomeUser //redirected when returned next
);

//log in user
app.get("/login", (req, res) => {
  res.render("Sign-In", { title: "Sign In" });
  console.log("Hello from login");
});

//log in form post
app.post(
  "/login",
  [
    body("email").notEmpty().withMessage("* Email cannot be empty."),
    body("password").notEmpty().withMessage("* Password cannot be empty."),
  ],
  (req, res) => {
    //let pass = true;
    let errMessage = {}; //dipslay error message on hbs view
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = errors.errors; //array of objects
      for (let i = 0; i < err.length; i++) {
        if (err[i].path == "email") errMessage.email = err[i].msg;
        else if (err[i].path == "password") errMessage.password = err[i].msg;
      }
      console.log(errMessage);
      res.render("Sign-In", {
        title: "Sign In",
        errMessage: errMessage,
        values: req.body,
      });
      //pass = false;
    } else {
      res.redirect("/shop-products");
    }
  }
);

//listen for requests
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on: " + HTTP_PORT);
});
