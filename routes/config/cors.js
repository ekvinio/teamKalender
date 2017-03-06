/**
 * Created by dev-kevinvanrijmenant on 8/24/15.
 *  cors.js im Backend
 */
module.exports = function(app){
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });
};