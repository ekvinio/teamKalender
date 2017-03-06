/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 * authentifizierung.js im Backend
 */
var jwt = require('jsonwebtoken');
var password = require('./passwords');

module.exports = function Authorized(req, res, next) {
    var authtoken;
    var tokenHeader = req.headers["authorization"];
    if (typeof tokenHeader !== 'undefined') {
        var tokenpart = tokenHeader.split(" ");
        authtoken = tokenpart[1];
        req.token = authtoken;
        jwt.verify(req.token,password.jwtpw,function(err,decoded){
           if(err)require('./tokenErrHandler')(err,res);
            else{
               next();
           }
        });
    } else {
        res.sendStatus(403);
    }
};