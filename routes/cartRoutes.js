const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/add-item-to-cart/:id", cartController.addItemToCart);

//shopping cart view
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
router.get("/checkout", (req, res) => {});
router.get("/remove-item/:id", cartController.removeItemFromCart);

router.delete("/empty-cart", cartController.emptyCart);

//add cart.item.quantity
router.get("/add-item-quantity/:id", cartController.addQuantityToCartItem);

//subtract cart.item.quantity
router.get(
  "/subtract-item-quantity",
  cartController.subtractQuantityFromCartItem
);

module.exports = router;
