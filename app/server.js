const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cosInstance = require('./objectStorage');
const config = require('./config.js');

const app = express();
const port = process.env.PORT || 3000;

const bucketName = config.COSBucketName;
const processedBucketName = config.COSProcessedBucketName;
app.use(fileUpload());
app.use(bodyParser.json());

app.post('/write', (req, res) => {
  console.log('Creating object');
  console.log(req.files.body);
  let url = '';
  cosInstance.putObject({
    Bucket: bucketName,
    Key: req.files.body.name,
    Body: req.files.body.data,
  }).promise()
    .then(() => {
      url = cosInstance.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: req.files.body.name,
      });
      return res.json({ name: req.files.body.name, url });
    })
    .catch((error) => {
      // res error code
      console.log(`Did you create a bucket with name "${bucketName}"?`);
      console.log(error);
    });
});

app.post('/getSignedUrl', (req, res) => {
  const url = cosInstance.getSignedUrl('getObject', {
    Bucket: processedBucketName,
    Key: req.body.filename,
  });
  return res.json({ url });
});

// serve static file (index.html, images, css)
app.use(express.static(`${__dirname}/ui`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
