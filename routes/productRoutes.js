const express = require("express");
const router = express.Router(); //invoke that.  this creates an instance of the router
const productsController = require("../controllers/productsController");
const { body, validationResult } = require("express-validator");
const Product = require("../models/ProductModel");
/*********************************
 * Multer config for image upload *
 **********************************/
//https://www.makeuseof.com/upload-image-in-nodejs-using-multer/
const multer = require("multer");
const path = require("path");

// Set up Multer storage
const Storage = multer.diskStorage({
  destination: "./static", //destination folder for uploaded images
  filename: (req, file, cb) => {
    //file naming scheme
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};
var upload = multer({
  storage: Storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

/***************************
 * Visitor/Customer ROUTES *
 ***************************/

//GET all products
router.get("/", function (req, res) {
  //only a customer or a visitor can see this page.  data clerk cannot shop

  //if there is no logged in user (visitor) OR the user is customer
  if (
    !req.session.user ||
    (req.session.user && !req.session.user.isDataEntryClerk)
  ) {
    productsController.getAllProducts(req, res);
  }
});

//GET a single product
router.get("/single_product", productsController.getProduct);

/*********************
 * Data Clerk Routes *
 *********************/

//create a new product
router.get("/create_product", productsController.postProductView);
router.post(
  "/create_product",
  //upload file before accessing req.body, otherwise req.body cant be accessed
  upload.single("testImage"),
  [
    body("product_name").notEmpty().withMessage("* Field cannot be empty."),
    body("product_desc").notEmpty().withMessage("* Field cannot be empty."),
    body("product_price").notEmpty().withMessage("* Field cannot be empty."),
  ],
  productsController.postProduct
);

//get a list of products with edit/delete button
router.get("/products_list", productsController.getProductsList);

//DELETE a single product
router.delete("/delete_product/:id", productsController.deleteProduct);

//UPDATE a single product
router.get("/edit_product/:id", productsController.editProductView); //form
//    action="/api/products/edit_product/{{data._id}}"
router.post(
  "/edit_product/:id",
  upload.single("testImage"),
  [
    body("ProductName").notEmpty().withMessage("* Field cannot be empty."),
    body("ProductDesc").notEmpty().withMessage("* Field cannot be empty."),
    body("ProductPrice").notEmpty().withMessage("* Field cannot be empty."),
  ],
  productsController.editProduct
); //post

module.exports = router;
