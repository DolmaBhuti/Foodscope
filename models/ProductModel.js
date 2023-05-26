const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// • Cooking time – 25 minutes
// • Servings – 2
// • Calories Per Serving – 890
// • Image URL – For now, point to an image placed in your static files folder.
// • Is it a Top Meal? (Boolean) – true
const productSchema = new Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductMaterials: {
      type: String,
      required: true,
    },
    ProductDesc: {
      type: String,
      required: true,
    },
    ProductCategory: {
      type: String,
      required: true,
    },
    ProductPrice: {
      type: Number,
      required: true,
    },
    ProductImage: {
      type: Number,
      required: true,
    },
    TopCase: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

//javascript array
var products = [
  ["Name", 19.99],
  ["Name", 19.99],
  ["Name", 19.99],
  ["Name", 19.99],
];

module.exports = mongoose.model("Products", productSchema);
