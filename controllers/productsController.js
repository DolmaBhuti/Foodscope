getAllProducts = (req, res) => {
  res.json({ msg: "get all product" });
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
