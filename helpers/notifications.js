// dependencies
const https = require('https');
const { twilio } = require('./environments');
const querystring = require('querystring');

// module scaffolding
const notifications = {};

// sent sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
  // input validation
  const userPhone =
    typeof phone === 'string' && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === 'string' &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    // configure the request payload
    const payload = {
      from: twilio.fromPhone,
      to: `+88${userPhone}`,
      body: userMsg,
    };
    // stringify the payload

    const stringifyPayload = querystring.stringify(payload);
    // configure the request details
    const requestDetails = {
      hostname: 'api.twilio.com',
      method: 'POST',
      path: `2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // instantiate the request object
    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      // callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });

    req.on('error', function (err) {
      callback(err);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callback('Given parameter missing or invalid');
  }
};
// exports notifications
module.exports = notifications;
