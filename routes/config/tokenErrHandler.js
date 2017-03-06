/**
 * Created by dev-kevinvanrijmenant on 8/26/15.
 * tokenErrHandler.js im Backend
 */
module.exports = function(err,res){
    if (err.name.indexOf('TokenExpiredError') != -1 || err.name.indexOf('JsonWebTokenError') != -1){
        res.sendStatus(403);
    }
};