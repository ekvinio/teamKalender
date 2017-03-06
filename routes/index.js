/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 * index.js im Backend
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var password = require('./config/passwords');

var con = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: 'toor',
  database : 'teamKalender'
});con.connect();

require('./config/initAdmin')(con);
require('./login')(router,con);
require('./user')(router,con);
require('./gruppe')(router,con);


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Termin kalender' });
});

module.exports = router;
