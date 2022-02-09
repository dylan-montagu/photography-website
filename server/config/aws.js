const AWS = require('aws-sdk');
const config = require('config');

const configureS3 = () => {
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  return s3;
};

module.exports = configureS3;
