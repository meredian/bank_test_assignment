#!/usr/bin/env node

var app = require('../app');
var http = require('http');

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
  case 'EACCES':
    console.error('Port' + port + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error('Port' + port + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

function onListening() {
  var addr = server.address();
  console.log('Listening on port ' + addr.port);
}
