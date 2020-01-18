const request = require('request');

function makeRequest (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error)
        reject(error);
      else
        resolve(response);
    })
  })
}

module.exports = {
  makeRequest,
};
