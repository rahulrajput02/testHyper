var express = require('express');
var router = express.Router();
var db = require('../connection.js');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
