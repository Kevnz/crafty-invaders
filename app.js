var server = require('static-cling').cling;

var port = process.env.PORT ? process.env.PORT : 3000
var path = __dirname + '/public/'
server(port, path);