const express = require("express");
const app = express();
const ejs = require("ejs");
const path =require("path");

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("views"));

app.get("/", (req, res) => {
    res.render(path.join(__dirname, "views","sign-up.ejs"));
});


app.listen(6000, () => {
    console.log("Danko Supreme");
});