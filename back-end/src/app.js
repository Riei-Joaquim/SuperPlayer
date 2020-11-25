const express = require("express");
const bodyparser = require("body-parser");
const cors = require('cors');
const routes = require("./routes");
const app = express();

app.use(bodyparser.json({limit: '4mb'}));
app.use(bodyparser.urlencoded({limit: '4mb',extended: true}));

app.use(cors());

app.use(routes);
module.exports = app;
