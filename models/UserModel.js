const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    Email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    Password: { type: String, required: true },
    isDataEntryClerk: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
userModel = mongoose.model("Users", UserSchema);

const user = {
  FirstName: "Alexis",
  LastName: "Seneca",
  Email: "dbhuti95@outlook.com",
  Password: "9&#kWLa%48k",
  isDataEntryClerk: false,
};
// function addInitialCustomer() {
//   bcrypt.hash(user.Password, 10).then((hash) => {
//     user.Password = hash;

//     let newUser = new userModel(user);

//     newUser
//       .save()
//       .then(() => {
//         console.log("customer data saved");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// }
// addInitialCustomer();

module.exports = userModel;
