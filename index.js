const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Unit Conveter", message: "Hello there" });
});

app.post("/", (req, res, next) => {
  const body = req.body;
  console.log(body);

  res.redirect("/");
});

app.use("/", (req, res) => {
  res.send("Error Not Found");
});

app.listen(port);
