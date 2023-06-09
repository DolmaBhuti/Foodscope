const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
const Products = mongoose.model("Products", productSchema); //define a Mongoose model
//javascript array
var products = [
  {
    ProductName: "TRUE Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone,Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone,Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "images/PC26-07.jpg",
    TopCase: false,
  },
];
//get ALL products
function getAllCases() {
  return products;
}
//get all meal kits that is TopCase
function getTopCases() {
  let topCases = products.filter((el) => {
    return el.TopCase == true;
  });
  return topCases;
}

module.exports = {
  getAllCases,
  getTopCases,
};
