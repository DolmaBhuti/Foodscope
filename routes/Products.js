const express = require("express");
const Product = require("../models/ProductModel");
const router = express.Router(); //invoke that.  this creates an instance of the router
const productsController = require("../controllers/productsController");
//GET all products
router.get("/", productsController.getAllProducts);

//GET a single product
router.get("/:id", productsController.getProduct);

// //GET all products in specific category
// router.get("/:category_id", (req, res) => {
//   res.json({ msg: "get all products in a category" });
// });

//POST a single product
router.post("/", productsController.postProduct);

//DELETE a single product
router.delete("/:id", productsController.deleteProduct);

//UPDATE a single product
router.patch("/:id", productsController.updateProduct);
module.exports = router;
