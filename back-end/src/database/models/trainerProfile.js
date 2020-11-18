const mongoose = require("../index");

const trainerSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    cargo:{
        type:String,
        required:true,
    },
    sobre:{
        type:String,
        required:true,
    },
    eu_ensino:{
        type:String,
        required:true,
    },
    eu_cobro:{
        type:String,
        required:true,
    },
    para_jog:{
        type:String,
        required:true,
    },
    trainer_mod:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:false,
    },
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:'comment',
    }],
    requests:[{
        type:mongoose.Types.ObjectId,
        ref:'interested',
    }],
    editedAt:{
        type:Date,
        default:Date.now,
    },
});

const trainerProfile = mongoose.model('trainer', trainerSchema);

module.exports = trainerProfile;