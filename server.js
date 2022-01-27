const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config(); 
const path = require('path');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/views"));

// app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
// app.set('view engine', '.hbs');

app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname,"/views/index.html"));
} )



function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
app.listen(HTTP_PORT, onHttpStart);