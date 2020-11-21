const User = require("../database/models/user");
const Trainer = require("../database/models/trainerProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

function generateToken(params = {}){
    return jwt.sign({id:params}, authConfig.secret, {
        expiresIn: 86400,
    } );
}

module.exports = {
    async register(req, res) {
        const { email } = req.body;
        try{
            if(await User.findOne({ email }))
                return res.status(400).send({error:'User already exists'});
            const user = await User.create(req.body);

            user.password = undefined;
            return res.send({
                user,
                token:generateToken({id:user.id}), 
            });
        }catch(err){
            res.status(400).send({error:'Registration failed: ' + err});
        }
    },

    async authenticate(req, res){
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user)
            return res.status(400).send({error:'User not found'});
        
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error:'Invalid password'});
        
        user.password = undefined;

        res.send({ 
            user, 
            token:generateToken({id:user.id}), 
        });
    },

    async deleteAccount(req, res){
        const { id } = req.userId;
        try{
            const user = await User.findById(id);
            if(user.trainer){
                await Trainer.findOneAndRemove({user:id});
                await User.findByIdAndRemove(id);
            }else{
                await User.findByIdAndRemove(id);
            }
            return res.send({status:"OK"});
        }catch(err){
            return res.status(400).send({error:'Error in delete user account: ' + err});
        }
    },
}  