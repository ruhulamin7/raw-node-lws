const environments = {};

environments.development = {
  port: 3000,
  envName: 'development',
  secretKey: 'hellosecretkey',
  maxChecks: 5,
  twilio: {
    fromPhone: '+15005550006',
    accountSid: 'ACb32d411ad7fe886aac5+665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
  },
};

environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'hellosecretdgbkey',
  maxChecks: 5,
  twilio: {
    fromPhone: '+15005550006',
    accountsid: 'ACb32d411ad7fe886aac5+665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
  },
};

// determine which environment passed
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV
    : 'development';

// export the corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.development;

// export
module.exports = environmentToExport;
