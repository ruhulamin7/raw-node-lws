// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};
// base directory of data folder
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = function (dir, file, data, callback) {
  // open file for writing
  fs.open(
    lib.basedir + dir + '/' + file + '.json',
    'wx',
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and close
        fs.writeFile(fileDescriptor, stringData, function (err, data) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing the new file');
              }
            });
          } else {
            callback('Error writing file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist!');
      }
    }
  );
};

// read data from file
lib.read = function (dir, file, callback) {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data);
  });
};

// update data from file
lib.update = function (dir, file, data, callback) {
  fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      // truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              });
            } else {
              callback('Error writing file');
            }
          });
        } else {
          callback('Error truncating the file');
        }
      });
    } else {
      callback('Error updating, file may not exist!');
    }
  });
};

// delete the file
lib.delete = function (dir, file, callback) {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
};

// exports
module.exports = lib;
