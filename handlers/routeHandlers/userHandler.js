//dependencies
const { user } = require('../../routes');
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['post', 'get', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : null;
  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : null;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === 'boolean'
      ? requestProperties.body.tosAgreement
      : null;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user does't already exist
    data.read('users', phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store the user to db
        data.create('users', phone, userObject, (err2) => {
          if (!err2) {
            callback(200, { message: 'User was created successfully' });
          } else {
            callback(500, { error: 'Could not create user' });
          }
        });
      } else {
        callback(500, { error: 'There was a problem in server side' });
      }
    });
  } else {
    callback(500, { error: 'You have a problem in your request!' });
  }
};

handler._users.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : null;
  if (phone) {
    // verify token
    let token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read('users', phone, (err, u) => {
          const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { error: 'Your requested user was not found!' });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication failed!',
        });
      }
    });
  } else {
    callback(404, { error: 'Your requested user was not found!' });
  }
};
handler._users.put = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.length === 11
      ? requestProperties.body.phone
      : null;
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : null;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : null;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      // verify token
      let token =
        typeof requestProperties.headersObject.token === 'string'
          ? requestProperties.headersObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup the user
          data.read('users', phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };
            console.log(userData);
            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }
            } else {
              callback(200, { message: 'You have a problem in your request' });
            }
            // update date to db
            data.update('users', phone, userData, (err2) => {
              console.log(err2);
              if (!err2) {
                callback(200, { message: 'User was updated successfully' });
              } else {
                callback(500, { error: 'There was a problem in server side!' });
              }
            });
          });
        } else {
          callback(403, {
            error: 'Authentication failed!',
          });
        }
      });
    } else {
      callback(400, { error: 'Your requested user was not found!' });
    }
  } else {
    callback(400, { error: 'Your requested user was not found!' });
  }
};
handler._users.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === 'string' &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : null;

  if (phone) {
    // verify token
    let token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read('users', phone, (err) => {
          if (!err) {
            data.delete('users', phone, (err) => {
              if (!err) {
                callback(200, {
                  message: 'User was deleted successfully!',
                });
              } else {
                console.log(err);
                callback(500, {
                  error: 'Server error',
                });
              }
            });
          } else {
            callback(500, {
              error: 'Your requested user or file was not found!',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Authentication failed!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Your requested user was not found!',
    });
  }
};

//exports
module.exports = handler;
