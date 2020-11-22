const express = require("express");

const authController = require("./controllers/authController");
const APPController = require("./controllers/aplicationController");
const authVerificate = require('./utils/auth');

const routes = express.Router();

routes.get("/", APPController.homePage);
routes.post("/register", authController.register);
routes.delete("/register", authVerificate, authController.deleteAccount);
routes.post("/user/edit", authVerificate, APPController.editProfile);
routes.post("/authenticate", authController.authenticate);
routes.post("/authenticate/forgot_passoword", authController.forgotPassword);
routes.post("/authenticate/reset_password", authController.resetPassword);
routes.post("/maketrainer", authVerificate, APPController.makeTrainerProfile);
routes.delete("/maketrainer", authVerificate, APPController.deleteTrainerProfile);
routes.get("/search", APPController.search);
routes.get("/trainer/:id", APPController.trainerInfo);
routes.post("/trainer/:id/request", authVerificate, APPController.requestLessons);
routes.delete("/trainer/request/:idRequest", authVerificate, APPController.deleteRequest);
routes.post("/trainer/:id/evaluate", authVerificate, APPController.trainerEvaluate);
routes.delete("/trainer/evaluate/:idComment", authVerificate, APPController.deleteEvaluate);

routes.post("/user/trainer/edit", authVerificate, APPController.editTrainerProfile);
routes.get("/user/trainer/requests", authVerificate, APPController.viewInterested);

module.exports = routes;
