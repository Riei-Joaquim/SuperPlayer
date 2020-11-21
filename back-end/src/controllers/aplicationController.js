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
    const searchAns = await Trainer.find({$or:[{role:RegExp(term)}, {teaching:RegExp(term)}]});
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
      return res.status(400).send({error:'Error in get trainer profile infos: '+ err});
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
      return res.status(400).send({error:'Error in get trainer infos: ' + err});
    }
  },

  async viewInterested(req, res) {
    const { id } = req.userId;
    try{
      const interested = await InterestedLessons.find({assignedTo:id});
      res.send(interested);
    }catch(err){
      return res.status(400).send({error:'Error in get users interested: ' + err});
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
          res.status(400).send({error:'Error in update user profile: ' + err})
        }});
      const tProfile = await Trainer.create({user:id,name:user.name,email:user.email, profileImage:user.profileImage,...req.body});
      return res.send({tProfile});
    }catch(err){
      return res.status(400).send({error:'Error creating trainer profile: ' + err});
    }
  },

  async deleteTrainerProfile(req, res) {
    const { id } = req.userId;
    try{
      const user = await User.findById(id);
      if(user.trainer){
        User.findByIdAndUpdate(id, {trainer:false}, function (err, docs) { 
          if (err){ 
            res.status(400).send({error:'Error in update user profile: ' + err})
          }});
        await Trainer.findOneAndRemove({user:id});
        return res.send({status:"OK"});
      }else{
        return res.status(400).send({error:'User not as trainer to delete'});
      }
    }catch(err){
      return res.status(400).send({error:'Error in delete trainer profile: ' +err});
    }
  },

  async requestLessons(req, res) {
    const { id } = req.params;
    if(id != req.userId.id){
      try{
        const user = await User.findById(req.userId.id);
        if(!user)
          return res.status(400).send({error:'User not found'});

        const interested = await InterestedLessons.create({name:user.name,email:user.email,assignedTo:id,observations:req.body.observations});
        return res.send(interested);
      }catch(err){
        return res.status(400).send({error:'Error creating interested message in profile: ' + err});
      }
    }else{
      return res.status(400).send({error:'Error self user request'});
    }
  },

  async deleteRequest(req, res) {
    const { idRequest } = req.params;
    try{
      const request = await InterestedLessons.findById(idRequest);
      const user = await User.findById(req.userId.id);
      if(req.userId.id == request.assignedTo || req.userId.id == user._id){
        await InterestedLessons.findByIdAndDelete(request._id);
        return res.send({status:"OK"});
      }else{
        return res.status(400).send({error:'Error user not allowed this delete'});
      } 
    }catch(err){
      return res.status(400).send({error:'Error in delete request: ' + err});
    }
  },

  async trainerEvaluate(req, res) {
    const { id } = req.params;
    if(id != req.userId.id){
      const idComm = Date.now() + generateId();
      try{
        const user = await User.findById(req.userId.id);
        const comment = await Comment.create({name:user.name,email:user.email,assignedTo:id,message:req.body.message, id_comment:idComm});
        return res.send({comment});
      }catch(err){
        return res.status(400).send({error:'Error creating comment in profile: ' +err});
      }
    }else{
      return res.status(400).send({error:'Error self user comment'});
    }
  },

  async deleteEvaluate(req, res) {
    const { idComment } = req.params;
    try{
      const comment = await Comment.findOne({id_comment:idComment});
      const user = await User.findOne({email:comment.email});
      if(req.userId.id == comment.assignedTo || req.userId.id == user._id){
        await Comment.findOneAndDelete({id_comment:idComment});
        return res.send({status:"OK"});
      }else{
        return res.status(400).send({error:'Error user not allowed this delete'});
      }  
    }catch(err){
      return res.status(400).send({error:'Error delete comment in profile: '+ err});
    }
  },
};