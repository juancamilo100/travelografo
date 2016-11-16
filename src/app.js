'use strict';

var express = require('express');
var parser = require('body-parser');
var markerRouter = require('./api/markers');
var blogRouter = require('./api/blogs');
var configRouter = require('./api/config');

var app = express();

require('./database');

app.use('/', express.static('../public'));
app.use('/', express.static('../public/templates'));
app.use(parser.json());

app.use('/api', markerRouter);
app.use('/api', blogRouter);
app.use('/api', configRouter);

app.listen(3000, function() {
    console.log("The server is running on port 3000!");
});
