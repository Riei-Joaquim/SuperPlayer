const mongoose = require("../index");

const trainerSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    profileImage:{
        type:String,
    },
    role:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    },
    teaching:{
        type:String,
        required:true,
    },
    cash:{
        type:String,
        required:true,
    },
    for_players:{
        type:String,
        required:true,
    },
    trainer_mod:{
        type:String,
        required:true,
    },
    desccription:{
        type:String,
        required:false,
    },
    editedAt:{
        type:Date,
        default:Date.now,
    },
});

const trainerProfile = mongoose.model('trainer', trainerSchema);

module.exports = trainerProfile;