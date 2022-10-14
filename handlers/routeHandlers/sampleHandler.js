// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: 'This is sample route',
  });
};

//exports
module.exports = handler;
