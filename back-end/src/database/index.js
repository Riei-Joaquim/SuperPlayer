const mongoose = require("mongoose");
const uri = "mongodb+srv://dbSuperPlayer:bb_rego199@cluster0.f6fff.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, {useMongoClient:true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
