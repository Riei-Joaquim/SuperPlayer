const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
module.exports = (req, res, next) =>{
    const authtoken = req.headers.token;

    if(!authtoken)
        return  res.status(401).send({error:'No token provided'});

    jwt.verify(authtoken, authConfig.secret, (err, decoded)=>{
        if(err)
            return res.status(401).send({error:'Token invalid'});
        
        req.userId = decoded.id;
        return next();
    });

};