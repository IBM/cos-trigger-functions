/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

async function main(params) {
  const visualRecognition = new VisualRecognitionV3({
    version: params.version,
    iam_apikey: params.apikey
  });
  try {
    const { url, bucket } = params;
    let { key } = params;

    const classifyParams = {
      url,
      threshold: 0.6,
    };
    let vrClasses;

    await visualRecognition.classify(classifyParams)
      .then((classifiedImages) => {
        vrClasses = classifiedImages.images[0].classifiers[0].classes;
      }).catch((err) => {
        console.log('error:', err);
      });

    let n = key.lastIndexOf('.');
    key = key.substring(0, n != -1 ? n : key.length);

    return {
      bucket: `${bucket}-processed`,
      key: `${key}_vr.txt`,
      body: JSON.stringify(vrClasses),
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

exports.main = main;
