// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

const { sentTwilioSms } = require('./helpers/notifications');

// app object - module scaffolding
const app = {};

// testing create file
// data.create('test', 'newFile', { name: 'Amin' }, (err) => {
//   console.log(err);
// });

// test twilio sms
// sentTwilioSms('01739713724', 'Hello Twilio', (err) => {
//   console.log(`This is the error`, err);
// });

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log('Server listening on port ' + environment.port);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
