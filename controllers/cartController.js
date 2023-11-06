const productModel = require("../models/ProductModel");
getCart = (req, res) => {
  (req, res) => {
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
  };
};

//cart model == [array of items (including quantity)]
//cart subtotal

addItemToCart = (req, res) => {
  productID = req.params.id;
  const user = req.session.user;

  if (user && !user.isDataEntryClerk) {
    console.log("in addItemToCart route");

    if (!req.session.cart) req.session.cart = {};
    if (req.session.subTotal == undefined) req.session.subTotal = 0;

    //check to see if this item already exists in the cart
    const itemIndex = req.session.cart.findIndex(function (object) {
      return object._id === productID;
    });

    //item does not exist in item
    if (itemIndex == -1) {
      console.log("item does not exist in cart");
      //find productId in mongoose productModel'
      productModel
        .findById(productID)
        .then((product) => {
          if (product) {
            console.log("product found", product._doc.ProductName);

            req.session.cart.push({
              //add product to session cart
              _id: product._id,
              ProductName: product.ProductName,
              ProductIngredients: product.ProductIngredients,
              ProductDesc: product.ProductDesc,
              ProductCategory: product.ProductCategory,
              CookingTime: product.CookingTime,
              Serving: product.Serving,
              Calories: product.Calories,
              ProductPrice: product.ProductPrice,
              featured: product.featured,
              filename: product.filename,
              mimetype: product.mimetype,
              quantity: 1,
              total: product.ProductPrice,
            });

            req.session.subTotal += product.ProductPrice;

            console.log(
              "Item pushed into cart, ",
              req.session.cart.ProductName
            );
            console.log("Subtotal is now ", req.session.subTotal);

            res.redirect("/api/cart/shopping-cart");
          } else {
            console.log("No such product found");
            return res.redirect("/api/products");
            //TODO: render shopping cart with error message (unable to add to cart)
            let errMessage = "Could not add item to cart.  Try again";
            res.render();
          }
        })
        .catch((err) => {
          console.log("No such product found, ", err);
          return res.redirect("/api/products");
        });
    } else {
      console.log("item does exist in cart");

      req.session.cart[itemIndex].quantity++;
      req.session.cart[itemIndex].total += cart[itemIndex].ProductPrice;
      req.session.subTotal += cart[itemIndex].ProductPrice;

      console.log(
        "Item quantity updated in cart, ",
        req.session.cart.ProductName,
        req.session.cart.quantity
      );
      console.log("Subtotal is now ", req.session.subTotal);
    }
    res.redirect("/api/cart/shopping-cart");
  }
};
addQuantityToCartItem = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    const itemIndex = req.session.cart.findIndex(function (object) {
      return (object._id = req.params.id);
    });

    if (itemIndex != -1) {
      //increment the quantity of the product at the index
      req.session.cart[itemIndex].quantity++;
      req.session.cart[itemIndex].total +=
        req.session.cart[itemIndex].ProductPrice;
      req.session.subTotal += req.session.cart[itemIndex].ProductPrice;
      console.log("quantity updated, ", req.session.cart);
      res.redirect("/api/cart/shopping-cart");
    }
  }
};

subtractQuantityFromCartItem = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    const itemIndex = req.session.cart.findIndex(function (object) {
      return (object._id = req.params.id);
    });

    if (itemIndex != -1) {
      //decrement the quantity of the product at the index
      if (req.session.cart[itemIndex].quantity <= 1) {
        req.session.cart.splice(itemIndex, 1);
      } else {
        req.session.cart[itemIndex].quantity--;
        req.session.cart[itemIndex].total -=
          req.session.cart[itemIndex].ProductPrice;
        req.session.subTotal -= req.session.cart[itemIndex].ProductPrice;
      }
      console.log("quantity updated, ", req.session.cart);
      res.redirect("/api/cart/shopping-cart");
    }
  }
};
emptyCart = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    delete req.session.cart;
    delete req.session.subTotal;
    res.redirect("/api/cart/shopping-cart");
  }
};

removeItemFromCart = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    //find index of product id in the cart
    const itemIndex = req.session.cart.findIndex(function (object) {
      return (object._id = req.params.id);
    });

    if (itemIndex != -1) {
      req.session.cart.splice(itemIndex, 1);
      console.log(req.session.cart);
      res.redirect("/api/cart/shopping-cart");
    }
  }
};

checkoutCart = (req, res) => {};

module.exports = {
  checkoutCart,
  addItemToCart,
  removeItemFromCart,
  getCart,
  emptyCart,
  subtractQuantityFromCartItem,
  addQuantityToCartItem,
};
