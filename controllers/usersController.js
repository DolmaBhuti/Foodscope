const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: { type: String, require: true, unique: true },
  password: String,
  eventId: [String],
  noteId: [String],
  timerId: [String],
  resetPasswordToken: String,
  resetPasswordExpires: Number,
});
var registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
    } else if (validator.validate(userData.userName) == false) {
      reject("Invalid email");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser.save((err) => {
            if (err) {
              if (err.code == 11000) {
                reject("Email already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            } else {
              resolve("User " + userData.userName + " successfully registered");
            }
          });
        })
        .catch((err) => reject(err));
    }
  });
};

module.exports = { registerUser };
