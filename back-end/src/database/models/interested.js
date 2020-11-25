const mongoose = require("../index");

const interestedShema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    id_request:{
        type:String,
        unique:true,
        required:true,
    },
    assignedTo:{
        type:String,
        required:true,
    },
    observations:{
        type:String,
        required:false,
    },
    status:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
const interested = mongoose.model('interested', interestedShema);

module.exports = interested
