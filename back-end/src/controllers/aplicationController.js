const User = require("../database/models/user");
const Trainer = require("../database/models/trainerProfile");
const Comment = require("../database/models/comment");
const InterestedLessons = require("../database/models/interested");
const mongoose = require("../database");
const generateId = require("../utils/generateId");

module.exports = {
  async homePage(req, res) {
    res.send("encontre treinadores para melhorar sua gameplay");
  },

  async search(req, res) {
    const { term } = req.query;
    const searchAns = await Trainer.find({role:RegExp(term)});
    res.send({searchAns});
  },

  async trainerInfo(req, res) {
    const { id } = req.params;

    try{
      const user = await User.findById(id);
      const comments = await Comment.find({assignedTo:id});
      const trainerProfile = await Trainer.findOne({user:id});
      trainerProfile.name = user.name;
      trainerProfile.email = user.email;
      res.send({trainerProfile,comments});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer profile infos'});
    }
  },

  async editProfile(req, res) {
    const { id } = req.userId;
    
    try{
      const user = await User.findById(id);
      if(!user.trainer)
        res.status(400).send({error:'Error user not as trainer to update profile'})
      
      await Trainer.findOneAndRemove({user:id});
      const tProfile = await Trainer.create({user:id,name:user.name,email:user.email,...req.body});
      return res.send({tProfile});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer sadasdasprofile infos'});
    }
  },

  async viewInterested(req, res) {
    const { id } = req.userId;
    try{
      const interested = await InterestedLessons.find({assignedTo:id});
      res.send(interested);
    }catch(err){
      return res.status(400).send({error:'Error in get users interested'});
    }
  },

  async makeTrainerProfile(req, res) {
    const { id } = req.userId;
    try{
      const user = await User.findById(id);

      if(await Trainer.findOne({email:user.email}))
        return res.status(400).send({error:'User already as trainer'});
      User.findByIdAndUpdate(id, {trainer:true}, function (err, docs) { 
        if (err){ 
          res.status(400).send({error:'Error in update user profile'})
        }});
      const tProfile = await Trainer.create({user:id,name:user.name,email:user.email,...req.body});
      return res.send({tProfile});
    }catch(err){
      return res.status(400).send({error:'Error creating trainer profile'});
    }
  },

  async requestLessons(req, res) {
    const { id } = req.params;
    if(id != req.userId){
      try{
        const user = await User.findById(req.userId.id);
        const interested = await InterestedLessons.create({name:user.name,email:user.email,assignedTo:id,observations:req.body.observations});
        return res.send({interested});
      }catch(err){
        return res.status(400).send({error:'Error creating interested message in profile'});
      }
    }else{
      return res.status(400).send({error:'Error self user request'});
    }
  },

  async trainerEvaluate(req, res) {
    const { id } = req.params;
    if(id != req.userId){
      const idComm = Date.now() + generateId();
      try{
        const user = await User.findById(req.userId.id);
        const comment = await Comment.create({name:user.name,email:user.email,assignedTo:id,message:req.body.message, id_comment:idComm});
        return res.send({comment});
      }catch(err){
        return res.status(400).send({error:'Error creating comment in profile '+ err});
      }
    }else{
      return res.status(400).send({error:'Error self user comment'});
    }
  },
};