//cart repository
const Cart = require("./models/CartModel");
//https://mongoosejs.com/docs/populate.html#saving-refs
//get all
cart = async () => {
  const carts = await Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  return carts[0];
};

//create new cart and add items (called when cart does not exist)
addItem = async (payload) => {
  const newItem = await Cart.create(payload);
  return newItem;
};

//add quantity
addQuantity = async (payload) => {
  let updatedCart = await Cart.updateOne(
    { _id: payload._id },
    { $set: { items: { quantity: quantity - 1 } } }
  );
};

//Product repository
const Product = require("./models/ProductModel");
products = async () => {
  const products = await Product.find();
  return products;
};
productById = async (id) => {
  let product = {};
  try {
    product = await Product.findById(id);
  } catch (err) {
    console.log(err);
  }
  console.log(product);
  return product;
};

module.exports = {
  cart,
  addItem,
  products,
  productById,
};
