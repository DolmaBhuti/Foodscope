const productsData = require("../models/ProductModel");

getAllProducts = (req, res) => {
  console.log("Hello from shop products");

  res.render("ShopProducts", {
    title: "Products",
    data: productsData.getAllCases,
  });
};
getProduct = (req, res) => {
  res.json({ msg: "get single product" });
};

postProduct = (req, res) => {
  res.json({ msg: "post a product" });
};
deleteProduct = (req, res) => {
  res.json({ msg: "delete a product" });
};
updateProduct = (req, res) => {
  res.json({ msg: "update a product" });
};
module.exports = {
  getAllProducts,
  getProduct,
  postProduct,
  deleteProduct,
  updateProduct,
};
