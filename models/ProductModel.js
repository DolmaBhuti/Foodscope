const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductIngredients: {
      type: String,
      required: true,
    },
    ProductDesc: {
      type: String,
      required: true,
    },
    ProductCategory: {
      type: String,
      required: true,
    },
    CookingTime: {
      type: Number,
    },
    Serving: {
      type: Number,
    },
    Calories: {
      type: Number,
    },
    ProductPrice: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Products = mongoose.model("Products", productSchema); //define a Mongoose model

//make
let products = [
  {
    ProductName: "Baked Salmon",
    ProductIngredients: "Salmon, carrot, cucumber, spinach, lemon, garlic",
    ProductDesc:
      "Baked salmon recipe seasoned with garlic, roasted lemons, and fresh herbs. A healthy family dinner ready in just 30 minutes. ",
    ProductCategory: "Dinner",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: true,
    filename: "recipe-baked-salmon.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Noodle Soup",
    ProductIngredients:
      "Beef ribs, dried chinese noodle, spinach, parsley, hoison sauce, cooking wine, soy sauce",
    ProductDesc:
      "A delicious soup with plenty of vibrant flavors that are brought together in one pot.",
    ProductCategory: "Dinner",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: true,
    filename: "recipe-chinese-noodlesoup.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Egg Burger",
    ProductIngredients:
      "sesame bun, egg, beef patty, tomato, lettuce, American cheese, onion, frozen fries",
    ProductDesc:
      "Juicy, mouthwatering, tasty, and everything you'd ever want to savor",
    ProductCategory: "Dinner",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: true,
    filename: "recipe-eggBurger.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "French Toast",
    ProductIngredients: "brioche bread, berries, maple syrup, custard",
    ProductDesc:
      "Made with thick-sliced brioche bread, a vanilla flavored egg-y custard, and topped with syrup. It's truly the definition of breakfast comfort food",
    ProductCategory: "Breakfast",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: true,
    filename: "recipe-fruit-frenchToast.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Butter Pancake",
    ProductIngredients:
      "flour, baking powder, sugar, salt, milk, butter, egg, berries, maple syrup",
    ProductDesc:
      "Look no further because a steaming stack of perfectly soft, Best Fluffy Pancakes are right here! Weekends will never be the same again!    ",
    ProductCategory: "Breakfast",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-pancake.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Pesto Pasta",
    ProductIngredients:
      "pesto, tagliatelle, cherry tomatoes, arugula, olive oil, salt",
    ProductDesc:
      "This quick and easy pesto pasta is a delicious vegetarian weeknight dinner! I like to add a handful of arugula, but feel free to skip it or use your favorite soft greens in its place.",
    ProductCategory: "Dinner",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-pestopasta.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Shrimp Stirfry",
    ProductIngredients:
      "shrimp, eggplant, bell peppers, honey, soy sauce, sesame oil, olive oil, ginger, garlic",
    ProductDesc:
      "This easy Chicken Stir Fry recipe is loaded with fresh veggies and the most delicious sauce made with honey, soy sauce, and toasted sesame oil!",
    ProductCategory: "Lunch",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-shrimp-stirfry.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Stuffed Eggplant",
    ProductIngredients:
      "eggplant, tomato, red onions, parsley, romano cheese, quinoa",
    ProductDesc:
      "Don’t discount the eggplant! This underrated veggie turns downright succulent when cooked correctly and stuffed with quinoa and veggies—it’s a hearty, comforting and a delight to the taste buds. ",
    ProductCategory: "Lunch",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-stuffedeggplant.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Tomato Soup",
    ProductIngredients:
      "butter, yellow onion, garlic, crushed tomatoes, chicken stock, basil, sugar, black pepper, whiping cream, parmesan cheese, parsley",
    ProductDesc:
      "This quick, easy tomato soup is comfort in a bowl, especially when it's topped with brown butter croutons.    ",
    ProductCategory: "Lunch",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-tomatoSoup.jpeg",
    mimetype: "image/jpeg",
  },
  {
    ProductName: "Quinoa With Baked beans",
    ProductIngredients: "Quinoa, green beans, chili, baked beans, salt",
    ProductDesc:
      "This simple green bean and quinoa salad is perfect for a quick side or served as a main with a little grilled chicken, chickpeas or tofu. Either way, this salad will be a hit!    ",
    ProductCategory: "Salad",
    CookingTime: 30,
    Serving: 4,
    Calories: 292,
    ProductPrice: 14.99,
    featured: false,
    filename: "recipe-vegan-quinoa.jpeg",
    mimetype: "image/jpeg",
  },
];

//save product function
function saveInitialData() {
  products.forEach(async (product) => {
    //make new product object
    const newProduct = new Products({
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
    });

    //save it into database
    await newProduct
      .save()
      .then(() => {
        console.log("initial data saved");
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
//saveInitialData();

module.exports = Products;
