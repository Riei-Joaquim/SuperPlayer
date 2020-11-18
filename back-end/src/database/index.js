const mongoose = require("mongoose");
const authConfig = require("../config/auth");
const uri = authConfig.uri;

mongoose.connect(uri, {useNewUrlParser:true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
