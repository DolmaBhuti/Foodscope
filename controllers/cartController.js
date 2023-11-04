const repository = require("../repository");
const productModel = require("../models/ProductModel");
// Get all cart items

//if there is no current cart, create a new one with 0 items and subtotal 0, and render the page
//cart model == [array of items (including quantity)]
//cart subtotal

//create object constructor for cart
//send in object and quantity

addItemToCart = (req, res) => {
  productID = req.params.id;
  const user = req.session.user;

  if (user && !user.isDataEntryClerk) {
    console.log("in addItemToCart route");
    //let cart = req.session.cart;
    //let subTotal = req.session.subTotal;

    if (!req.session.cart) {
      req.session.cart = {};
    }
    if (req.session.subTotal == undefined) {
      req.session.subTotal = 0;
    }

    //check to see if this item already exists in the cart
    const itemIndex = req.session.cart.findIndex(function (object) {
      return object._id === productID;
    });

    console.log("item index, ", itemIndex);

    //item does not exist in item
    if (itemIndex == -1) {
      console.log("object does not exist in cart");
      //find productId in mongoose productModel'
      productModel
        .findById(productID)
        .then((product) => {
          if (product) {
            //add product to session cart
            console.log("product found", product._doc.ProductName);

            //add all properties to cart item //add quantity property

            req.session.cart.push({
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

            console.log("Item pushed into cart, ", req.session.cart);
            console.log("req.session.subtotal update, ", req.session.subTotal);
            res.redirect("/api/cart/shopping-cart");
          } else {
            console.log("No such product found");
            return res.redirect("/api/products");
            //TODO: render shopping cart with error message (unable to add to cart)
          }
        })
        .catch((err) => {
          console.log("No such product found, ", err);
          return res.redirect("/api/products");
        });
    } else {
      //item already exists (increment quantity) and update total and subtotal
      req.session.cart[itemIndex].quantity++;
      req.session.cart[itemIndex].total += cart[itemIndex].ProductPrice;
      req.session.subTotal += cart[itemIndex].ProductPrice;
    }
  }
};
addQuantityToCartItem = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    //find index of product id in the cart
    const itemIndex = req.session.cart.findIndex(function (object) {
      return (object._id = req.params.id);
    });

    //increment the quantity of the product at the index
    req.session.cart[itemIndex].quantity++;
    req.session.cart[itemIndex].total +=
      req.session.cart[itemIndex].ProductPrice;
    req.session.subTotal += req.session.cart[itemIndex].ProductPrice;
    console.log("quantity updated, ", req.session.cart);
    res.redirect("/api/cart/shopping-cart");
  }
};

subtractQuantityFromCartItem = (req, res) => {
  if (req.session.user && !req.session.user.isDataEntryClerk) {
    //find index of product id in the cart
    const itemIndex = req.session.cart.findIndex(function (object) {
      return (object._id = req.params.id);
    });

    //if cart item quantity is less than 0
    if (req.session.cart[itemIndex].quantity <= 1) {
      req.session.cart.splice(itemIndex, 1);
    } else {
      //decrement the quantity of the product at the index
      req.session.cart[itemIndex].quantity--;
      req.session.cart[itemIndex].total -=
        req.session.cart[itemIndex].ProductPrice;
      req.session.subTotal -= req.session.cart[itemIndex].ProductPrice;
    }

    console.log("quantity updated, ", req.session.cart);
    res.redirect("/api/cart/shopping-cart");
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
    req.session.cart.splice(itemIndex, 1);
    console.log(req.session.cart);
    res.redirect("/api/cart/shopping-cart");
  }
};
getCart = (req, res) => {};

checkoutCart = (req, res) => {};

// try {
//   let cart = await repository.cart();
//   if (!cart) {
//     res.status(401).send({ message: "No Cart Found" });
//     cart = {
//       items: null,
//       subTotal: 0,
//     };
//   }
//   //render the page, either with a populated cart or an empty cart
// } catch (err) {
//   console.log(err);

//   //TODO: view
//   res.status(400).send({
//     type: "Invalid",
//     msg: "Something went wrong",
//     err: err,
//   });
//   //reload page
//   res.redirect("back");
// }
//};

// Add product items to the cart
// addItemToCart = async (req, res) => {
//   const productId = req.params.id;
//   const quantity = Number.parseInt(req.body.quantity);

//   try {
//     //get cart
//     let cart = await repository.cart();

//     //get product
//     let product = await repository.productById(productId);

//     if (!product) {
//       return res.status(500).json({
//         type: "Not Found",
//         msg: "Invalid request",
//       });
//     }

//     //if cart exists
//     if (cart) {
//       //--check for item in cart
//       //--get item index
//       let itemIndex = cart.items.findIndex(
//         (item) => item.productId === productId //item.productId._id OR item.productId.id
//       );

//       //----if item exists AND quantity < 1,remove item from the the cart. We can use this method to remove an item from the list  -------
//       if (itemIndex !== -1 && quantity < 1) {
//         cart.items.splice(itemIndex, 1);
//         if (cart.items.length == 0) {
//           cart.subTotal = 0;
//         } else {
//           //update subtotal after removing the item
//           cart.subTotal = cart.items
//             .map((item) => item.total)
//             .reduce((acc, next) => acc + next);
//         }
//       }
//       //----else if index is found, add the previous quantity with the new quantity and update the total price-------
//       else if (itemIndex !== -1) {
//         cart.items[itemIndex].quantity += quantity;
//         cart.items[itemIndex].total =
//           cart.items[itemIndex].quantity * product.ProductPrice;
//         cart.items[itemIndex].price = product.ProductPrice;
//         cart.subTotal = cart.items
//           .map((item) => item.total)
//           .reduce((acc, next) => acc + next);
//       }

//       //----else if index is NOT found and quantity > 0, push new item into items array
//       else if (quantity >= 1) {
//         cart.items.push({
//           productId: productId,
//           quantity: quantity,
//           price: product.ProductPrice,
//           total: parseInt(product.ProductPrice * quantity),
//         });

//         //update cart subtotal
//         cart.subTotal = cart.items
//           .map((item) => item.total)
//           .reduce((acc, next) => acc + next);
//       }
//       //----else return  error
//       else {
//         return res.status(400).json({
//           type: "Invalid",
//           msg: "Invalid request",
//         });
//       }
//       //return success (refresh same page)
//       let data = await cart.save();
//       res
//         .status(200)
//         .json({ type: "success", mgs: "Process successful", data: data });
//     }
//     //if cart does not exist
//     //--create new cart and add items to cart
//     else {
//       const cartData = {
//         items: [
//           {
//             productId: productId,
//             quantity: quantity,
//             total: parseInt(product.ProductPrice * quantity),
//             price: product.ProductPrice,
//           },
//         ],
//         subTotal: parseInt(product.ProductPrice * quantity),
//       };
//       cart = await repository.addItem(cartData);
//       // let data = await cart.save();

//       console.log("new cart made with object" + cartData);
//       res.json(cart);
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: e,
//     });
//   }
// };
// //remove item from cart
// removeItemFromCart = async (req, res) => {
//   const { productId } = req.body; //

//   try {
//     //get cart
//     let cart = await repository.cart();
//     let product = await repository.productById(productId);

//     if (!product) {
//       return res.status(500).json({
//         type: "Not Found",
//         msg: "Invalid request",
//       });
//     }

//     //if cart exists
//     if (cart) {
//       //check if item already exist in cart
//       //--get item index
//       let itemIndex = cart.items.findIndex(
//         (item) => item.productId.id === productId
//       );

//       //---- remove the item from the list  -------
//       if (itemIndex !== -1) {
//         cart.items.splice(itemIndex, 1);
//         if (cart.items.length == 0) {
//           cart.subTotal = 0;
//         } else {
//           //update subtotal after removing the item
//           cart.subTotal = cart.items
//             .map((item) => item.total)
//             .reduce((acc, next) => acc + next);
//         }
//       }
//     }
//     //TODO: route to shopping cart view
//     res.render("customer/ShoppingCart", {
//       products: cart.items,
//       cart: cart,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: e,
//     });
//   }
// };

// //add quantity
// addQuantityToCartItem = async (req, res) => {
//   const { productId } = req.body;

//   try {
//     //get cart
//     let cart = await repository.cart();
//     let product = await repository.productById(productId);

//     if (!product) {
//       return res.status(500).json({
//         type: "Not Found",
//         msg: "Invalid request",
//       });
//     }

//     //if cart exists
//     if (cart) {
//       //get index of item
//       let itemIndex = cart.items.findIndex(
//         (item) => item.productId === productId
//       );

//       //if index is above -1
//       if (itemIndex != -1) {
//         //increase quantity by one
//         cart.items[itemIndex].quantity += 1;

//         //update cart items total
//         cart.items[itemIndex].total = parseInt(
//           cart.items[itemIndex].quantity * cart.items[itemIndex].price
//         );

//         //update subtotal after quantity change
//         cart.subTotal = cart.items
//           .map((item) => item.total)
//           .reduce((acc, next) => acc + next);

//         //save changes to db
//         cart.save();

//         //TODO: route to shopping cart view
//         res.render("customer/ShoppingCart", {
//           products: cart.items,
//           cart: cart,
//         });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: e,
//     });
//   }
// };

// //subtract quantity
// subtractQuantityFromCartItem = async (req, res) => {
//   const { productId } = req.body;
//   try {
//     let cart = await repository.cart();
//     let product = await repository.productById(productId);

//     if (!product) {
//       return res.status(500).json({ Error: "Error getting product" });
//     }

//     if (cart) {
//       //get item index
//       let itemIndex = cart.items.findIndex(
//         (item) => item.productId === productId
//       );
//       //if index is not -1
//       if (itemIndex !== -1) {
//         //decrease quantity by one
//         cart.items[itemIndex].quantity -= 1;
//         //check if the quantity has gone below or equal to zero and remove it from array
//         if (cart.items[itemIndex].quantity <= 0) {
//           cart.items.splice(itemIndex, 1);
//         }
//         //update cart items total
//         cart.items[itemIndex].total = parseInt(
//           cart.items[itemIndex].price * cart.items[itemIndex].quantity
//         );
//         //update subtotal after quantity change
//         cart.subTotal = cart.items
//           .map((item) => item.total)
//           .reduce((acc, curr) => acc + curr);
//       }
//       cart.save(); //save changes to db

//       //TODO: route to shopping cart view
//       res.render("customer/ShoppingCart", {
//         products: cart.items,
//         cart: cart,
//       });
//     }
//   } catch (e) {
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: e,
//     });
//   }
// };

// // Empty cart
// emptyCart = async (req, res) => {
//   try {
//     let cart = await cartRepository.cart();
//     cart.items = [];
//     cart.subTotal = 0;
//     let data = await cart.save();
//     res.status(200).json({
//       type: "success",
//       mgs: "Cart has been emptied",
//       data: data,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: err,
//     });
//   }
// };
// checkoutCart = async (req, res) => {
//   //get all items from cart
//   //const cart = await repository.cart();
//   try {
//     const cart = req.session.cart;
//     res.redirect(303, session.url);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };

module.exports = {
  checkoutCart,
  addItemToCart,
  removeItemFromCart,
  //getCart,
  emptyCart,
  subtractQuantityFromCartItem,
  addQuantityToCartItem,
};
