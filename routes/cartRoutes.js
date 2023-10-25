const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/add-item-to-cart", cartController.addItemToCart);

//shopping cart view
router.get("/shopping-cart", cartController.getCart);
router.delete("/empty-cart", cartController.emptyCart);
router.post("/create-checkout-session", cartController.checkoutCart);

//add cart.item.quantity
router.post("/add-item-quantity", cartController.addQuantityToCartItem);

//subtract cart.item.quantity
router.post(
  "/subtract-item-quantity",
  cartController.subtractQuantityFromCartItem
);

module.exports = router;
