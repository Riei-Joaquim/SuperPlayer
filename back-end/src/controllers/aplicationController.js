const User = require("../database/models/user");
const Trainer = require("../database/models/trainerProfile");

module.exports = {
  async homePage(req, res) {
    res.send("encontre treinadores para melhorar sua gameplay");
  },

  async search(req, res) {
    const { term } = req.query;
    res.send("pesquisa realizada sobre "+ term);
  },

  async trainerInfo(req, res) {
    const { id } = req.params;
    db.collection('evaluate').find().toArray()
    .then(results => {
      console.log(results)
    })
    .catch(error => console.error(error))
    res.send("infos sobre "+ id);
  },

  async editProfile(req, res) {
    const { id } = req.params;
    const { userid } = req.userId
    res.send("editando o perfil: "+ id + " " + userid);
  },

  async viewInterested(req, res) {
    const { id } = req.params;
    const { userid } = req.userId
    res.send("interessados do perfil:"+ id + " " + userid);
  },

  async makeTrainerProfile(req, res) {
    const { id } = req.userId;
    Trainer.create(req.body);
    res.send("Perfil deseja ser trainer: "+ id );
  },

  async requestLessons(req, res) {
    const { name, email, observations, op } = req.body;
    res.send("voce pediu aulas de " + name + " " + email + " "+ observations + " " + op + " " + req.userId);
  },

  async trainerEvaluate(req, res) {
    const { id } = req.params;
    const { name, email, message, op } = req.body
    res.send("voce comentou no perfil de " + id + " " + name + " " + email + " "+ message +" "+ op+ " " + req.userId);
  },
};