// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

// app object - module scaffolding
const server = {};

// create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(environment.port, () => {
    console.log('Server listening on port ' + environment.port);
  });
};

// handle request response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

// export server
module.exports = server;
