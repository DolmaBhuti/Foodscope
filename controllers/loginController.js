"use strict";

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

//For Register Page
function registerView(req, res) {
  res.render("Registration", { title: "Register" });
  console.log("Hello from registration");
}
// For View
function loginView(req, res) {
  res.render("Sign-In", { title: "Sign In" });
  console.log("Hello from login");
}

//welcome page for new user
function welcomeUser(req, res) {
  var context = req.dataProcessed; //registered user data
  res.render("welcome.hbs", { data: context });
}
var registerUser = function (userData) {
  let user = {
    FirstName: userData.first_name,
    LastName: userData.last_name,
    Email: userData.email,
    Password: userData.password,
    isDataEntryClerk: userData.role,
  };
  return new Promise(function (resolve, reject) {
    if (user.Password != userData.confirm_password) {
      console.log(user.Password + " - " + userData.confirm_password);
      reject("Passwords do not match");
    } else {
      //send email

      bcrypt
        .hash(user.Password, 10)
        .then((hash) => {
          user.Password = hash;

          let newUser = new User(user);

          newUser
            .save()
            .then(() => {
              resolve("User " + newUser.FirstName + " successfully registered");
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject("Email already taken");
              } else {
                console.log("There was an error creating the user:", err);
                reject(
                  new Error("There was an error creating the user: " + err)
                );
              }
            });
        })
        .catch((err) => {
          reject(err);
          console.log("Error in bcrypt promise:", err);
        });
    }
  });
};

module.exports = { registerView, loginView, registerUser, welcomeUser };
