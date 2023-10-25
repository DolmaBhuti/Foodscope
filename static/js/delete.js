"use strict";

function deleteProduct(id) {
  console.log("In JS deleteProduct function");
  fetch(`delete_product/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Product successfully deleted");

        // Perform any additional actions or UI updates
        location.reload();
      } else {
        console.log("Error occurred while deleting the product");
      }
    })
    .catch((err) => {
      console.error("Error deleting product: ", err);
    });
}
