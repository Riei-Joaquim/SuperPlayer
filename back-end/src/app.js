const express = require("express");
const bodyparser = require("body-parser")
const routes = require("./routes");
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(routes);

module.exports = app;
