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
const mongoose = require("mongoose");

//route controllers
getAllProducts = (req, res) => {
  Product.find({})
    .lean()
    .then((allData) => {
      console.log("Success: get all products");

      res.render("ShopProducts", {
        title: "Products",
        data: allData,
      });
    })
    .catch((err) => {
      console.log("Error getting all products: ", err);
    });
};
getProduct = (req, res) => {
  res.json({ msg: "get single product" });
};

/************************
 * Data Clerk Functions *
 ************************/

//get products list
getProductsList = (req, res) => {};
//post product view and form data
postProductView = (req, res) => {
  res.render("data_clerk/CreateProduct", {
    title: "New Product",
  });
};
postProduct = (req, res) => {
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
};
//Get all products
function getProducts() {
  Product.find({})
    .lean()
    .then((allData) => {
      return allData;
    })
    .catch((err) => {
      console.log("Error: getting all products: ", err);
      return null;
    });
}
//get all products for data clerk to edit
getProductsList = (req, res) => {
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
};
deleteProduct = (req, res) => {
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
};
editProductView = (req, res) => {
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
};
editProduct = (req, res) => {
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
};
/**********************
 * Customer Functions *
 **********************/
//get image
getImage = (req, res) => {
  Product.findById(req.params.id);
};

//get ALL products
function getAllCases() {
  //TODO: get all products
  //TODO: render the ProductsListView.hbs with all the products sent in as data property

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
};
