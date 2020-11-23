const mongoose = require("mongoose");
let uri = process.env.MONGODB_URI;

if(!uri){
    const authConfig = require("../config/auth");
    uri = authConfig.uri;
}
    
mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
