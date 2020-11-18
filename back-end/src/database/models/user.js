const mongoose = require("../index");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    trainer:{
        type:Boolean,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const user = mongoose.model('user', UserSchema);

module.exports = user