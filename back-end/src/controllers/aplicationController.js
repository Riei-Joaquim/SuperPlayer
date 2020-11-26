const User = require("../database/models/user");
const Trainer = require("../database/models/trainerProfile");
const Comment = require("../database/models/comment");
const InterestedLessons = require("../database/models/interested");
const mongoose = require("../database");
const generateId = require("../utils/generateId");

module.exports = {
  async homePage(req, res) {
    res.send("encontre treinadores para melhorar sua gameplay!");
  },

  async search(req, res) {
    const { term } = req.query;
    const searchAns = await Trainer.find({$or:[{role:RegExp(term, 'i')}, {teaching:RegExp(term, 'i')}]});
    res.send({searchAns});
  },

  async trainerInfo(req, res) {
    const { id } = req.params;

    try{
      const user = await User.findById(id);
      const comments = await Comment.find({assignedTo:id});
      const trainerProfile = await Trainer.findOne({user:id});
      let sum = 0;
      comments.forEach(function(item){
        sum += Number(item.ranking);
      })

      if(comments.length > 0){
        trainerProfile.ranking = (sum/comments.length).toString();
      }else{
        trainerProfile.ranking = '0';
      }
      
      trainerProfile.name = user.name;
      trainerProfile.email = user.email;
      res.send({trainerProfile,comments});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer profile infos: '+ err});
    }
  },

  async TopTrainer(req, res) {
    try{
      const groups = await InterestedLessons.aggregate(
        [{"$group":{_id:"$assignedTo", count:{$sum:1}}}, {'$sort':{'count':-1}}]
      );

      let TopProfiles = [];
      if(groups.length >=3)
        TopProfiles = await Trainer.find({$or:[{user:groups[0]._id}, {user:groups[1]._id}, {user:groups[2]._id}]});
      else if(groups.length >=2)
        TopProfiles = await Trainer.find({$or:[{user:groups[0]._id}, {user:groups[1]._id}]});
      else
        TopProfiles = await Trainer.find({user:groups[0]._id});

      return res.send({TopProfiles});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer profile infos: '+ err});
    }
  },
  
  async editProfile(req, res) {
    const { id } = req.userId;
    
    try{
      const user = await User.findById(id);
      await User.findByIdAndUpdate( id, {
        '$set':{
            name:req.body.name,
            profileImage:req.body.profileImage,
        }
      });

      if(user.trainer)
      await Trainer.findOneAndUpdate({user:id}, {
        '$set':{
            name:req.body.name,
            profileImage:req.body.profileImage,
        }
      })
      user.name = req.body.name;
      user.profileImage = req.body.profileImage;
      return res.send({user});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer infos: ' + err});
    }
  },

  async editTrainerProfile(req, res) {
    const { id } = req.userId;
    try{
      const user = await User.findById(id);
      if(!user.trainer){
        User.findByIdAndUpdate(id, {trainer:true}, function (err, docs) { 
          if (err){ 
            return res.status(400).send({error:'Error in update user profile: ' + err})
          }});
      }else{
        await Trainer.findOneAndRemove({user:id});
      }
      const tProfile = await Trainer.create({user:id,name:user.name, email:user.email, profileImage:user.profileImage, ...req.body});
      return res.send({tProfile});
    }catch(err){
      return res.status(400).send({error:'Error in get trainer infos: ' + err});
    }
  },

  async viewInterested(req, res) {
    const { id } = req.userId;
    try{
      const interested = await InterestedLessons.find({assignedTo:id, status:'OPEN'});
      res.send(interested);
    }catch(err){
      return res.status(400).send({error:'Error in get users interested: ' + err});
    }
  },

  async viewUserProfile(req, res) {
    const { id } = req.userId;
    try{
      const user = await User.findById(id);
      const interested = await InterestedLessons.find({email:user.email});
      res.send(interested);
    }catch(err){
      return res.status(400).send({error:'Error in get user requests: ' + err});
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
          return res.status(400).send({error:'Error in update user profile: ' + err})
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
            return res.status(400).send({error:'Error in update user profile: ' + err})
          }});
        await Trainer.findOneAndRemove({user:id});

        const comments = await Comment.find({assignedTo:id});
        comments.forEach(async function(item){
          await Comment.findByIdAndDelete(item._id);
        });
        const requests = await InterestedLessons.find({assignedTo:id});
        requests.forEach(async function(item){
          await Comment.findByIdAndDelete(item._id);
        })
        return res.send();
      }else{
        return res.status(400).send({error:'User not as trainer to delete'});
      }
    }catch(err){
      return res.status(400).send({error:'Error in delete trainer profile: ' +err});
    }
  },

  async requestLessons(req, res) {
    const { id } = req.params;
    try{
      const{name, email, observations } = req.body;
      const searchAns = await InterestedLessons.find({email:email,assignedTo:id, status:'OPEN'});
      if(searchAns.length > 0)
        return res.status(400).send({error:'Error previous requests still open'});

      const idRequest = Date.now() + generateId();
      const interested = await InterestedLessons.create({name:name,email:email,assignedTo:id,status:'OPEN', id_request:idRequest,observations:observations});
      return res.send(interested);
    }catch(err){
      return res.status(400).send({error:'Error creating interested message in profile: ' + err});
    }
  },

  async deleteRequest(req, res) {
    const { idRequest } = req.params;
    try{
      const request = await InterestedLessons.findOne({id_request:idRequest});
      const user = await User.findById(req.userId.id);
      if(req.userId.id == request.assignedTo || req.userId.id == user._id){
        await InterestedLessons.findByIdAndUpdate( request._id, {
          '$set':{
            status:'CLOSE'
          }
        });
        return res.send();
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
        const searchAns = await InterestedLessons.find({email:user.email,assignedTo:id, status:'CLOSE'});
        if(searchAns.length > 0){
          const comment = await Comment.create({name:user.name,email:user.email,assignedTo:id,message:req.body.message, ranking:req.body.ranking, id_comment:idComm});
          return res.send({comment});
        }else{
          return res.status(400).send({error:'Error user never took classes with this trainer'});
        }
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