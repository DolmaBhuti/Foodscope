"use strict";

//button element reference
const plus = document.getElementById("plus-qty");
const minus = document.getElementById("minus-qty");

//event listeners
plus.addEventListener("click", fetchPlus);
minus.addEventListener("click", fetchMinus);

//fetch function to add quantity to item
function fetchPlus() {
  fetch(`${SERVER_URL}/api/cart/add-item-quantity`)
    .then((response) => {
      if (response.status !== 200) {
        console.log(
          "Problem fetching /api/cart/add-item-quantity route: " +
            response.status
        );
      } else {
        console.log("Success fetching /api/cart/add-item-quantity route");
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}
//fetch function to subtract quantity to item
function fetchMinus() {
  fetch(`${SERVER_URL}/api/cart/subtract-item-quantity`)
    .then((response) => {
      if (response.status !== 200) {
        console.log(
          "Problem fetching /api/cart/add-item-quantity route: " +
            response.status
        );
      } else {
        console.log("Success fetching /api/cart/subtract-item-quantity route");
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}
