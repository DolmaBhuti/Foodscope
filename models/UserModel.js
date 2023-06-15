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
    isDataEntryClerk: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
