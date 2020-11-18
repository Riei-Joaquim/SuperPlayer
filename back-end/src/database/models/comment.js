const mongoose = require("../index");

const commentShema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
const comment = mongoose.model('comment', commentShema);

module.exports = comment
