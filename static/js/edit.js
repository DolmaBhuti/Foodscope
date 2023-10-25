function editProduct(id) {
  console.log("In JS editProduct function");
  fetch(`edit_product/${id}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Product successfully edited");
      } else {
        // Handle the error and display an appropriate message
        console.log("Error occurred while editing the product");
      }
    })
    .catch((err) => {
      console.error("Error deleting product: ", err);
    });
}
//{
/* <form id="myForm">
  <input type="text" name="productName" id="productName" />
  <button type="submit">Update</button>
</form>;

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const form = document.getElementById("myForm");
  const formData = new FormData(form);

  // Make the PUT request using Fetch API
  fetch("your-api-endpoint", {
    method: "PUT",
    body: formData,
  })
    .then((response) => {
      // Handle the response
    })
    .catch((error) => {
      // Handle the error
    });
}); */
