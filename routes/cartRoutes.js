const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.post("/add-item-to-cart/:id", cartController.addItemToCart);

router.get("/shopping-cart", cartController.getCart);

router.get("/remove-item/:id", cartController.removeItemFromCart);

router.delete("/empty-cart", cartController.emptyCart);

router.get("/add-item-quantity/:id", cartController.addQuantityToCartItem);

router.get(
  "/subtract-item-quantity/:id",
  cartController.subtractQuantityFromCartItem
);

router.get("/checkout", (req, res) => {});

module.exports = router;
