"use strict";

//javascript array
var products = [
  {
    ProductName: "TRUE Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "iPhone 13 Pro Max",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone,Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "iPhone Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: true,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone, Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: false,
  },
  {
    ProductName: "Marble Purple Case",
    ProductMaterials: "Silicone,Polycarbonate",
    ProductDesc: "AirPod Pro Case",
    ProductCategory: "Airpods Case",
    ProductPrice: 10.99,
    ProductImage: "/images/PC26-07.jpg",
    TopCase: false,
  },
];
const productsData = require("../models/ProductModel");
const { body, validationResult } = require("express-validator");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
const mongoose = require("mongoose");

/************************
 * Data Clerk Functions *
 ************************/

//get products list
function getProductsList(req, res) {}
//post product view and form data
function postProductView(req, res) {
  res.render("/data_clerk/CreateProduct", {
    title: "New Product",
  });
}
function postProduct(req, res) {
  //error handle image upload
  const errors = validationResult(req);
  let errMessage = {};

  if (req.file) {
    //image was uploaded properly
    console.log("Multer: Image file uploaded successfully");

    console.log(req.file);
    if (!errors.isEmpty()) {
      console.log("Error: Product form front-end validation failed");
      const err = errors.errors; //array of objects
      for (let i = 0; i < err.length; i++) {
        if (err[i].path == "ProductName") errMessage.ProductName = err[i].msg;
        else if (err[i].path == "ProductDesc")
          errMessage.ProductDesc = err[i].msg;
        else if (err[i].path == "ProductPrice")
          errMessage.ProductPrice = err[i].msg;
      }
      console.log(errMessage);
      res.render("data_clerk/CreateProduct", {
        title: "New Product",
        errMessage: errMessage,
        values: req.body,
      });
    } else {
      console.log("Product form front-end validation passed");
      const { filename, mimetype } = req.file;

      let product = {
        ProductName: req.body.ProductName,
        ProductDesc: req.body.ProductDesc,
        ProductPrice: req.body.ProductPrice,
        mimetype,
        filename,
      };
      let newProduct = new Product(product);
      newProduct
        .save()
        .then((data) => {
          console.log(
            "Mongo: Product " + newProduct.ProductName + " successfully saved"
          );

          //redirect to dataclerk dashboard
          res.redirect("../../data_clerk"); //at route /data_clerk
        })
        .catch((err) => {
          console.error("Mongo: Error saving new product: ", err);
        });
    }
  } else {
    //image not uploaded properly
    console.log("Multer: Image file upload failed");

    errMessage.image = "Please upload a valid image";
    res.render("data_clerk/CreateProduct", {
      title: "New Product",
      errMessage: errMessage,
      values: req.body,
    });
  }
}

//get all products for data clerk to edit
function getProductsList(req, res) {
  //TODO: get all products
  Product.find({})
    .lean()
    .then((allData) => {
      console.log("Success: get all products");
      //TODO: render the ProductsListView.hbs with all the products sent in as data property
      res.render("data_clerk/ProductsListView", { data: allData });
    })
    .catch((err) => {
      console.log("Error: getting all products: ", err);
    });
}
function deleteProduct(req, res) {
  let errMessage = {};

  //TODO: delete product
  Product.deleteOne({ _id: req.params.id })
    .then((data) => {
      console.log("Product deleted");
    })
    .catch((err) => {
      console.log("Error deleting product: ", err);
      errMessage.delete = "Could not delete product.  Try again later.";
    });
  res.end();
}
function editProductView(req, res) {
  console.log("in edit view route");

  //TODO: get product with id
  Product.findOne({ _id: req.params.id })
    .then((doc) => {
      //TODO: render the form view with the data passed in
      //Mongoose documents have a prototype object with inherited properties, including "_id".
      //Mongoose provides a toObject() method that converts a document to a plain JavaScript object, removing the inherited properties
      //Access the property using the {{this}} keyword
      console.log(doc.toObject());
      res.render("data_clerk/EditProduct", { data: doc.toObject() });
    })
    .catch((err) => {
      console.log("Error: getting product to edit: ", err);
    });
}
function editProduct(req, res) {
  //error handle image upload
  const errors = validationResult(req);
  let errMessage = {};
  const productId = req.params.id;

  if (req.file) {
    //image was uploaded properly
    console.log("Multer: Image file uploaded successfully");

    console.log(req.file);
    if (!errors.isEmpty()) {
      console.log("Error: Product form front-end validation failed");
      const err = errors.errors; //array of objects
      for (let i = 0; i < err.length; i++) {
        if (err[i].path == "ProductName") errMessage.ProductName = err[i].msg;
        else if (err[i].path == "ProductDesc")
          errMessage.ProductDesc = err[i].msg;
        else if (err[i].path == "ProductPrice")
          errMessage.ProductPrice = err[i].msg;
      }
      console.log(errMessage);
      res.render("data_clerk/EditProduct", {
        title: "Edit Product",
        errMessage: errMessage,
        data: req.body,
      });
    } else {
      console.log("Product form front-end validation passed");
      const { filename, mimetype } = req.file;

      Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ProductName: req.body.ProductName,
            ProductDesc: req.body.ProductDesc,
            ProductPrice: req.body.ProductPrice,
            mimetype,
            filename,
          },
        }
      )
        .then((data) => {
          console.log(
            "Mongo: Product " + data.ProductName + " successfully updated"
          );
          res.redirect("../products_list");
        })
        .catch((err) => {
          console.error("Mongo: Error updating product: ", err);
          res.render("data_clerk/EditProduct", {
            title: "Edit Product",
            errMessage: errMessage,
            data: req.body,
          });
        });
    }
  } else {
    //image not uploaded properly
    console.log("Multer: Image file upload failed");

    errMessage.image = "Please upload a valid image";
    res.render("data_clerk/EditProduct", {
      title: "Edit Product",
      errMessage: errMessage,
      data: req.body,
    });
  }
}
/**********************
 * Customer Functions *
 **********************/
//get image
function getImage(req, res) {
  Product.findById(req.params.id);
}

function getProduct(req, res) {
  Product.findById(req.params.id)
    .then((doc) => {
      //create shopping cart in sessions
      if (!req.session.cart) {
        req.session.cart = [];
      }
      res.render("customer/ProductDescription", {
        data: doc.toObject(),
        title: doc.ProductName,
        cart: req.session.cart,
      });
    })
    .catch((err) => {});
}

//adding to shopping cart collection
function addToShoppingCart(req, res) {
  const productId = req.params.id;
  const productName = req.body.ProductName;
  const productPrice = req.body.ProductPrice;
  let count = 0; //use to check if product exists already

  //if the product already exists in the cart, just increment the quantity in the session AND database
  for (let i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i].ProductId === productId) {
      req.session.cart[i].Quantity += 1;
      req.session.cart[i].ProductTotal += req.session.cart[i].ProductPrice;

      count++;

      //db.employees.updateOne({_id:1}, { $set: {firstName:'Morgan'}})
      Cart.updateOne(
        { ProductId: productId },
        {
          $set: {
            Quantity: req.session.cart[i].Quantity,
            ProductTotal: req.session.cart[i].ProductTotal,
          },
        }
      )
        .then((doc) => {
          console.log("Cart: product quantity updated");
        })
        .catch((err) => {
          console.log("Cart: product quantity unable to be updated: ", err);
        });
    }
  }

  //if the product does not exist, create a cart object and save it in the session and database
  if (count == 0) {
    const cart_object = {
      ProductId: productId,
      ProductName: productName,
      ProductPrice: productPrice,
      Quantity: 1,
      ProductTotal: productPrice,
    };
    req.session.cart.push(cart_object);
    console.log("Product saved to shopping cart session.");

    //find product with id
    Product.findById(productId)
      .then((doc) => {
        console.log("Add to shopping cart route: product found");

        //add to shopping cart collection
        let newProduct = new Cart({
          ProductId: cart_object.ProductId,
          ProductName: cart_object.ProductName,
          ProductPrice: cart_object.ProductPrice,
          Quantity: cart_object.Quantity,
          ProductTotal: cart_object.ProductTotal,
        });
        newProduct
          .save()
          .then((doc) => {
            console.log("Product saved to shopping cart database.");
            //res.redirect(`../product_description/${req.params.id}`);
          })
          .catch((err) => {
            console.log("Error saving new item into shopping cart ", err);
          });
      })
      .catch();
  }
  res.redirect("/api/products");
}

//shopping cart view page
function shoppingCart(req, res) {
  let total_bill = 0;
  Cart.find({})
    .lean()
    .then((data) => {
      //Calculate total of all Product Totals
      for (let i = 0; i < data.length; i++) {
        total_bill += data[0].ProductTotal;
      }
      //render shopping cart page with all data passed in that was found
      res.render("customer/ShoppingCart", {
        title: "Shopping Cart",
        cart: data,
        total: total_bill,
      });
    });
}
//get ALL products
//TODO: get all products
//TODO: render the ProductsListView.hbs with all the products sent in as data property

//route controllers
function getAllProducts(req, res) {
  Product.find({})
    .lean()
    .then((allData) => {
      console.log("Success: get all products");

      //create shopping cart in sessions
      if (!req.session.cart) {
        req.session.cart = [];
      }
      res.render("ShopProducts", {
        title: "Products",
        data: allData,
        cart: req.session.cart,
      });
    })
    .catch((err) => {
      console.log("Error getting all products: ", err);
    });
}

//get all meal kits that is TopCase
function getTopCases() {
  let topCases = products.filter((el) => {
    return el.TopCase == true;
  });
  return topCases;
}

module.exports = {
  getAllProducts,
  getProduct,
  postProduct,
  postProductView,
  deleteProduct,
  getImage,
  getProductsList,
  getTopCases,
  editProductView,
  editProduct,
  shoppingCart,
};

// //get reference to checkout form
// const form = document.getElementById("checkout-form");
// const cardNumber = document.getElementById("card-number");
// const cvcNumber = document.getElementById("cvc");
// const expMonth = documet.getElementById("exp-month");
// const expYear = documet.getElementById("exp-year");
