const mongoose = require("../index");

const commentShema = new mongoose.Schema({
    id_comment:{
        type:String,
        unique:true,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    assignedTo:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    message:{
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
