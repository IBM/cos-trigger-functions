/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */

const gm = require('gm').subClass({ imageMagick: true });
const request = require('request');

async function main(params) {
  try {
    const { url, bucket } = params;
    let { key } = params;

    const buffer = await charcoal(url);
    const n = key.lastIndexOf('.');
    key = key.substring(0, n != -1 ? n : key.length);
    return {
      bucket: `${bucket}-processed`,
      key: `${key}_grey.png`,
      body: buffer,
    };
  } catch (err) {
    console.log(err);
    return Promise.reject({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { message: err.message },
    });
  }
}
 
function charcoal(url) {
  return new Promise((resolve) => {
    gm(request(url)).charcoal(5).toBuffer('PNG', (err, buffer) => {
      if (err) return handle(err);
      resolve(buffer);
      console.log('done!');
    });
  });
}

exports.main = main;
