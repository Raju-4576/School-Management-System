var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use('/api', indexRouter);


module.exports = app;
