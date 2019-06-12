const COS_SDK = require('ibm-cos-sdk');
const config = require('./config.js');
const creds = require('./credentials.json');

let cosCredentials;

if (process.env.OBJECTSTORAGE_CREDENTIALS) {
  console.log('Found Object Storage credentials in OBJECTSTORAGE_CREDENTIALS env var');
  cosCredentials = JSON.parse(process.env.OBJECTSTORAGE_CREDENTIALS);
} else {
  console.log('Missing env var OBJECTSTORAGE_CREDENTIALS, using credentials.json');
  cosCredentials = creds.OBJECTSTORAGE_CREDENTIALS;
}

const cosConfig = {
  endpoint: config.EndPointURL,
  apiKeyId: cosCredentials.apikey,
  ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
  serviceInstanceId: cosCredentials.resource_instance_id,
  // these two are required to generate presigned URLs
  credentials: new COS_SDK.Credentials(cosCredentials.cos_hmac_keys.access_key_id, cosCredentials.cos_hmac_keys.secret_access_key, sessionToken = null),
  signatureVersion: 'v4',
};
const cos = new COS_SDK.S3(cosConfig);


module.exports = cos;
