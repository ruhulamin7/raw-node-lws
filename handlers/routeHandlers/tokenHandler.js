//dependencies
const data = require('../../lib/data');
const { hash, createRandomString } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { token } = require('../../routes');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ['post', 'get', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
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

  if (phone && password) {
    data.read('users', phone, (err, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() * 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store the token
        data.create('tokens', tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: 'There was a problem is server side!',
            });
          }
        });
      } else {
        callback(400, { error: 'Password did not match;' });
      }
    });
  } else {
    callback(500, { error: 'You have a problem in your request!' });
  }
};
handler._token.get = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    // lookup user
    data.read('tokens', id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };

      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { error: 'Your requested token was not found!' });
      }
    });
  } else {
    callback(404, { error: 'Your requested user was not found!' });
  }
};
handler._token.put = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : null;
  const extend =
    typeof requestProperties.body.extend === 'boolean' &&
    requestProperties.body.extend === true
      ? true
      : false;
  if (id && extend) {
    data.read('tokens', id, (err, tokenData) => {
      let tokenObject = { ...parseJSON(tokenData) };
      console.log(tokenObject);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;

        data.update('tokens', id, tokenObject, (err) => {
          if (!err) {
            callback(200, {
              message: 'Token updated successfully',
            });
          } else {
            callback(500, { error: 'There was a server error !' });
          }
        });
      } else {
        callback(400, { error: 'Token already expired !' });
      }
    });
  } else {
    callback(400, { error: 'There was a problem in your request!' });
  }
};
handler._token.delete = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : null;

  if (id) {
    data.read('tokens', id, (err) => {
      if (!err) {
        data.delete('tokens', id, (err) => {
          if (!err) {
            callback(200, {
              message: 'Token was deleted successfully!',
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
          error: 'Your requested token or file was not found!',
        });
      }
    });
  } else {
    callback(404, {
      error: 'Your requested token was not found!',
    });
  }
};

// token verify
handler._token.verify = (id, phone, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

//exports
module.exports = handler;
