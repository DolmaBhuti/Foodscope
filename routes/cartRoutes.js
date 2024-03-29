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

router.get("/empty-cart", cartController.emptyCart);

router.post("/add-item-quantity/:id", cartController.addQuantityToCartItem);

router.post(
  "/subtract-item-quantity/:id",
  cartController.subtractQuantityFromCartItem
);

router.get("/checkout", cartController.checkoutCart);

module.exports = router;
