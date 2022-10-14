//dependencies
const environments = require('./environments');
const crypto = require('crypto');
// module scaffolding
const utilities = {};

// parse JSON data to object
utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// hashing password
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', environments.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  } else {
    return false;
  }
};

// create random string
utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === 'number' && strlength > 0 ? strlength : false;

  // console.log(length);
  if (length) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    for (let i = 1; i <= length; i++) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  } else {
    return;
  }
};
// exports
module.exports = utilities;
