const express = require("express");
const router = express.Router(); //invoke that.  this creates an instance of the router
const bcrypt = require("bcryptjs");
const loginController = require("../controllers/loginController");
const productController = require("../controllers/productsController");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");

//set up express-validator: it performs both validation and sanitization of our form data
const { body, validationResult } = require("express-validator");

//sign up user form
router.get("/registration", loginController.registerView);

//log in user form
router.get("/login", loginController.loginView);

//home page
router.get("/", (req, res) => {
  res.render("index", { data: Product.getTopCases });
});
router.get("/welcome", loginController.welcomeUser);

//registration form post
router.post(
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
      //everything went well
      if (req.body.password === req.body.confirm_password) {
        //check if email is unique

        //encrypt password using bcrypt

        //send email welcome message.
        //change email client address
        // message.to = req.body.email;
        // sgMail
        //   .send(message)
        //   .then((res) => console.log("Email sent to " + message.to))
        //   .catch((error) => {
        //     console.log("Error sending email: " + error.message);

        //     if (error.response) {
        //       console.error(error.response.body);
        //     }
        //   });

        //TODO: create a user document in database
        loginController
          .registerUser(req.body)
          .then((result) => {
            console.log(`Successful registration of user: ${result}`);
            req.dataProcessed = user;
            return next();
          })
          .catch((err) => {
            res.status(422).json({ message: err });
            console.log(
              "error in registerUser function from controller: " + err
            );
          });

        //TODO: send in data that the welcome page will use
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
  loginController.welcomeUser //redirected when returned next
);
//log in form post
router.post(
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
      //find document
      //password: 9&#kWLa%48k
      User.findOne({
        Email: req.body.email,
        isDataEntryClerk: req.body.role,
      })
        .then((data) => {
          bcrypt.compare(
            req.body.password,
            data.Password,
            function (err, result) {
              if (err) {
                errMessage.invalid =
                  "Sorry, your passwords don't match.  Please try again.";
                res.render("Sign-In", {
                  title: "Sign In",
                  errMessage: errMessage,
                  values: req.body,
                });
              } else {
                // Add the user on the session and redirect them to the dashboard page.
                //create a new session for logged in user document returned by MongoDB
                req.session.user = data;
                console.log("Login successful: ", req.session.user);

                //if data clerk, redirect to data clerk dashboard
                if (data.isDataEntryClerk) {
                  res.redirect("/data_clerk");
                } else {
                  //else, redirect to customer dashboard
                  res.redirect("/customer");
                }
                // return next();
              }
            }
          );
        })
        .catch((err) => {
          res.status(500);
          errMessage.invalid =
            "Sorry, your email and/or role is wrong.  Please try again.";
          res.render("Sign-In", {
            title: "Sign In",
            errMessage: errMessage,
            values: req.body,
          });
          console.log("Could not find this user: " + err);
        });
    }
  }
  // productController.getAllProducts
);

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/login");
});
// //data clerk dashboard
router.get("/data_clerk", function (req, res) {
  if (req.session && req.session.user && req.session.user.isDataEntryClerk) {
    // res.redirect("load_data");
    res.render("DataClerkDashboard", { data: req.session.user });
  }
});

// //customer dashboard
router.get("/customer", function (req, res) {
  if (req.session && req.session.user && !req.session.user.isDataEntryClerk) {
    res.render("CustomerDashboard", { data: req.session.user });
  }
});

module.exports = router;
