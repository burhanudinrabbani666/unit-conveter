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
  res.redirect("/length");
});

app.get("/length", (req, res) => {
  res.render("index", {
    title: "length",
    units: [
      "millimeter",
      "centimeter",
      "meter",
      "kilometer",
      "inch",
      "foot",
      "yard",
      "mile",
    ],
  });
});

app.get("/weight", (req, res) => {
  res.render("index", {
    title: "weight",
    units: ["milligram", "gram", "kilogram", "ounce", "pound"],
  });
});

app.get("/temprature", (req, res) => {
  res.render("index", {
    title: "temprature",
    units: ["celsius", "fahrenheit", "kelvin"],
  });
});

app.get("/result", (req, res) => {
  const { result, from, to, value } = req.query;
  const text = `${value} ${from} = ${result} ${to}`;
  res.render("index", {
    title: "result",
    text,
  });
});

// POST
app.post("/length", async (req, res, next) => {
  const { value, from, to } = req.body;

  const toMeters = {
    millimeter: (v) => v / 1000,
    centimeter: (v) => v / 100,
    meter: (v) => v,
    kilometer: (v) => v * 1000,
    inch: (v) => v * 0.0254,
    foot: (v) => v * 0.3048,
    yard: (v) => v * 0.9144,
    mile: (v) => v * 1609.344,
  };

  const fromMeters = {
    millimeter: (v) => v * 1000,
    centimeter: (v) => v * 100,
    meter: (v) => v,
    kilometer: (v) => v / 1000,
    inch: (v) => v / 0.0254,
    foot: (v) => v / 0.3048,
    yard: (v) => v / 0.9144,
    mile: (v) => v / 1609.344,
  };

  if (!toMeters[from] || !fromMeters[to]) {
    throw new Error(`Unsupported length unit: ${from} or ${to}`);
  }

  const meters = toMeters[from](parseFloat(value));
  const result = fromMeters[to](parseFloat(meters));

  res.redirect(`/result?result=${result}&from=${from}&to=${to}&value=${value}`);
});

app.post("/weight", (req, res) => {
  const { value, from, to } = req.body;

  const toGrams = {
    milligram: (v) => v / 1000,
    gram: (v) => v,
    kilogram: (v) => v * 1000,
    ounce: (v) => v * 28.3495,
    pound: (v) => v * 453.592,
  };

  const fromGrams = {
    milligram: (v) => v * 1000,
    gram: (v) => v,
    kilogram: (v) => v / 1000,
    ounce: (v) => v / 28.3495,
    pound: (v) => v / 453.592,
  };

  if (!toGrams[from] || !fromGrams[to]) {
    throw new Error(`Unsupported weight unit: ${from} or ${to}`);
  }

  const grams = toGrams[from](parseFloat(value));
  const result = fromGrams[to](parseFloat(grams));

  res.redirect(`/result?result=${result}&from=${from}&to=${to}&value=${value}`);
});

app.post("/temprature", (req, res) => {
  const { value, from, to } = req.body;

  const toCelsius = {
    celsius: (v) => v,
    fahrenheit: (v) => (v - 32) * (5 / 9),
    kelvin: (v) => v - 273.15,
  };

  const fromCelsius = {
    celsius: (v) => v,
    fahrenheit: (v) => (v * 9) / 5 + 32,
    kelvin: (v) => v + 273.15,
  };

  if (!toCelsius[from] || !fromCelsius[to]) {
    throw new Error(`Unsupported temperature unit: ${from} or ${to}`);
  }

  const celsius = toCelsius[from](parseFloat(value));
  const result = fromCelsius[to](parseFloat(celsius));

  res.redirect(`/result?result=${result}&from=${from}&to=${to}&value=${value}`);
});

app.use("/", (req, res) => {
  res.send("Error Not Found");
});

app.listen(port);
