const express = require("express");

const authController = require("./controllers/authController");
const APPController = require("./controllers/aplicationController");
const authVerificate = require('./utils/auth');

const routes = express.Router();

routes.get("/", APPController.homePage);
routes.post("/register", authController.register);
routes.post("/authenticate", authController.authenticate);
routes.post("/maketrainer", authVerificate, APPController.makeTrainerProfile);
routes.get("/search", APPController.search);
routes.get("/trainer/:id", APPController.trainerInfo);
routes.post("/trainer/:id/request", authVerificate, APPController.requestLessons);
routes.post("/trainer/:id/evaluate", authVerificate, APPController.trainerEvaluate);

routes.post("/user/trainer/edit", authVerificate, APPController.editProfile);
routes.get("/user/trainer/requests", authVerificate, APPController.viewInterested);

module.exports = routes;
