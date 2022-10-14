// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  console.log('Not Found');
  callback(404, { message: 'Your requested URL was not found' });
};

//exports
module.exports = handler;
