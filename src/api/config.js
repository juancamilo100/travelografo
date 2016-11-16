'use strict';

var express = require('express');
var configData = require('../models/configData');

var router = express.Router();

router.get('/config', function(req, res) {

    console.log("Config data is: ");
    console.log(configData);
    res.json(configData);
});

module.exports = router;
