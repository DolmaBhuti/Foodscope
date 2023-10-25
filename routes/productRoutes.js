const express = require("express");
const router = express.Router(); //invoke that.  this creates an instance of the router
const productsController = require("../controllers/productsController");
const { body, validationResult } = require("express-validator");
const Product = require("../models/ProductModel");
const Cart = require("../models/CartModel");
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
router.get("/product_description/:id", productsController.getProduct);

//add item to shopping cart
router.post("/shopping_cart/:id", (req, res, next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId)
    .then((doc) => {
      cart.add(doc, doc._id);
      req.session.cart = cart;

      console.log(req.session.cart);
      res.redirect("/api/products/");
    })
    .catch((err) => {
      console.log("error finding product ", err);
      res.redirect("/api/products/");
    });
});

//shopping cart page
// router.get("/shopping_cart", (req, res, next) => {
//   if (!req.session.cart) {
//     //if no shopping cart, make products null
//     return res.render("customer/ShoppingCart", { products: null });
//   }
//   var cart = new Cart(req.session.cart);
//   res.render("customer/ShoppingCart", {
//     products: cart.generateArray(),
//     totalPrice: cart.totalPrice,
//   });
// });

//checkout
// router.get("/checkout", (req, res, next) => {
//   if (!req.session.cart) {
//     return res.redirect("/api/products/shopping_cart");
//   }
//   var cart = new Cart(req.session.cart);
//   res.render("customer/checkout", { total: cart.totalPrice });
// });

//router.post("/create-checkout-session", productsController.checkoutCart);

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
