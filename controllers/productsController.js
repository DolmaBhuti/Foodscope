"use strict";

const { body, validationResult } = require("express-validator");
const Product = require("../models/ProductModel");
//const Cart = require("../models/CartModel");
const mongoose = require("mongoose");

/************************
 * Data Clerk Functions *
 ************************/

//post product view and form data
function postProductView(req, res) {
  if (req.session.user && req.session.user.isDataEntryClerk) {
    res.render("data_clerk/CreateProduct", {
      title: "New Product",
    });
  }
}
function postProduct(req, res) {
  if (req.session.user && req.session.user.isDataEntryClerk) {
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
          ProductIngredients: req.body.ProductIngredients,
          ProductCategory: req.body.ProductCategory,
          CookingTime: req.body.CookingTime,
          Calories: req.body.Calories,
          Serving: req.body.Serving,
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
}

function deleteProduct(req, res) {
  let errMessage = {};
  if (req.session.user && req.session.user.isDataEntryClerk) {
    //TODO: delete product
    Product.deleteOne({ _id: req.params.id })
      .then((data) => {
        console.log("Product deleted");
      })
      .catch((err) => {
        console.log("Error deleting product: ", err);
        errMessage.delete = "Could not delete product.  Try again later.";
        res.render("DataClerkDashboard", {
          title: "Your dashboard",
          errMessage: errMessage,
        });
      });
    res.render("DataClerkDashboard", {
      title: "Your dashboard",
    });
  }
}
function editProductView(req, res) {
  console.log("in edit view route");

  if (req.session.user && req.session.user.isDataEntryClerk) {
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

        errMessage.edit = "Could not find product.  Try again later.";

        res.render("DataClerkDashboard", {
          title: "Your dashboard",
          errMessage: errMessage,
        });
      });
  }
}
function editProduct(req, res) {
  if (req.session.user && req.session.user.isDataEntryClerk) {
    //error handle image upload
    const errors = validationResult(req);
    let errMessage = {};
    const productId = req.params.id;

    if (req.file !== undefined) {
      //provided a file in form
      //image was uploaded properly
      console.log("Multer: Image file uploaded successfully");

      console.log(req.file);
      const { filename, mimetype } = req.file;

      Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            mimetype,
            filename,
          },
        }
      )
        .then((data) => {
          console.log(
            "Mongo: Product " + data.ProductName + " image successfully updated"
          );
          res.redirect("../products_list");
        })
        .catch((err) => {
          console.error("Mongo: Error updating product image: ", err);
          errMessage.image =
            "Image could not be updated at this time.  Try again.";
          return res.render("data_clerk/EditProduct", {
            title: "Edit Product",
            errMessage: errMessage,
            data: req.body,
          });
        });
    } else {
      //image not uploaded properly
      console.log("Multer: Image file input not filled.");
    }

    if (!errors.isEmpty()) {
      console.log("Error: Product form front-end validation failed");
      const err = errors.errors; //array of objects
      for (let i = 0; i < err.length; i++) {
        if (err[i].path == "ProductName") errMessage.ProductName = err[i].msg;
        else if (err[i].path == "ProductDesc")
          errMessage.ProductDesc = err[i].msg;
        else if (err[i].path == "ProductIngredients")
          errMessage.ProductIngredients = err[i].msg;
        else if (err[i].path == "ProductPrice")
          errMessage.ProductPrice = err[i].msg;
        else if (err[i].path == "ProductCategory")
          errMessage.ProductCategory = err[i].msg;
        else if (err[i].path == "CookingTime")
          errMessage.CookingTime = err[i].msg;
        else if (err[i].path == "Calories") errMessage.Calories = err[i].msg;
        else if (err[i].path == "Serving") errMessage.Serving = err[i].msg;
      }
      console.log(errMessage);
      return res.render("data_clerk/EditProduct", {
        title: "Edit Product",
        errMessage: errMessage,
        data: req.body,
      });
    } else {
      console.log("Product form front-end validation passed");

      Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ProductName: req.body.ProductName,
            ProductDesc: req.body.ProductDesc,
            ProductPrice: req.body.ProductPrice,
            ProductIngredients: req.body.ProductIngredients,
            ProductCategory: req.body.ProductCategory,
            CookingTime: req.body.CookingTime,
            Calories: req.body.Calories,
            Serving: req.body.Serving,
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

module.exports = {
  getAllProducts,
  getProduct,
  postProduct,
  postProductView,
  deleteProduct,
  getImage,
  editProductView,
  editProduct,
  shoppingCart,
};
