const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/add-item-to-cart/:id", cartController.addItemToCart);

//function doesnt work in controller
router.get("/shopping-cart", (req, res) => {
  const user = req.session.user;
  console.log("Getting cart for user, " + user);
  if (user && !user.isDataEntryClerk) {
    if (!req.session.cart) {
      req.session.cart = [];
      req.session.subTotal = 0;
    }
    res.render("customer/ShoppingCart", {
      products: req.session.cart,
      subTotal: req.session.subTotal,
      title: "Your Cart",
    });
  }
});

router.get("/remove-item/:id", cartController.removeItemFromCart);

router.delete("/empty-cart", cartController.emptyCart);

router.get("/add-item-quantity/:id", cartController.addQuantityToCartItem);

router.get(
  "/subtract-item-quantity/:id",
  cartController.subtractQuantityFromCartItem
);

router.get("/checkout", (req, res) => {
  res.render("customer/checkout");
});

module.exports = router;
