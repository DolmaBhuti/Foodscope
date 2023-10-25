const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductDesc: {
      type: String,
      required: true,
    },
    ProductPrice: {
      //in cents
      type: Number,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = Products = mongoose.model("Products", productSchema); //define a Mongoose model
