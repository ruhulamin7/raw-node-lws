const environments = {};

environments.development = {
  port: 3000,
  envName: 'development',
  secretKey: 'hellosecretkey',
};

environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'hellosecretdgbkey',
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
