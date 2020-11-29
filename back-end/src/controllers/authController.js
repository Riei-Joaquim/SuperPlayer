const User = require("../database/models/user");
const Trainer = require("../database/models/trainerProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const mailer = require('../mail/mailer');
let secret = process.env.SECRET_HASH;

if(!secret){
    const authConfig = require("../config/auth");
    secret = authConfig.secret;
}

function generateToken(params = {}){
    return jwt.sign({id:params}, secret, {
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
            res.status(500).send({error:'Registration failed: ' + err});
        }
    },

    async authenticate(req, res){
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user || !await bcrypt.compare(password, user.password))
            return res.status(401).send({error:'User or Password error'});
        
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
            return res.send();
        }catch(err){
            return res.status(400).send({error:'Error in delete user account: ' + err});
        }
    },

    async forgotPassword(req, res){
        const { email } = req.body;
        try{
            const user = await User.findOne({email:email});

            if(!user)
                return res.status(400).send({error:'User not found'});

            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate( user.id, {
                '$set':{
                    passwordResetToken:token,
                    passwordResetExpires:now,
                }
            });

            mailer.sendMail({
                to:email,
                from: 'requests@SuperPlayer.com.br',
                template: '../mail/template/forgotPassword',
                context:{token},
            }, (err)=>{
                if(err)
                    return res.status(400).send({error:'Cannot send forgot password email: ' + err});
            });
            res.send();

        }catch(err){
            return res.status(400).send({error:'Erro in forgot password, try again: ' + err});
        }
    },

    async resetPassword(req, res){
        const { email, token, password} = req.body;
        try{
            const user = await User.findOne({email:email}).select('+passwordResetToken passwordResetExpires');
            if(!user)
                return res.status(400).send({error:'User not found'});

            if(token != user.passwordResetToken)
                return res.status(400).send({error:'Token invalid'});
            
            const now = new Date()
            if(now > user.passwordResetExpires)
                return res.status(400).send({error:'Token expired, generate a new one: '});

            user.password = password;
            await user.save();
            res.send();
        }catch(err){
            return res.status(400).send({error:'Cannot reset password, try again: ' + err});
        }
    },
}  