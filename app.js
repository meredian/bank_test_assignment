var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var errors = require('./lib/errors');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV != 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === 'JsonSchemaValidation') {
    err = errors.parseJsonSchemaValidationError(err);
  }

  const error = { error: err.code };

  ['details', 'message'].forEach((prop) => {
    if (err[prop]) {
      error[prop] = err[prop]
    }
  });

  if (req.app.get('env') === 'development') {
    error.stacktrace = err.stack;
    if (!err.status) {
      console.log(err)
    }
  }

  res.status(err.status || 500);
  res.json(error);
});

module.exports = app;
