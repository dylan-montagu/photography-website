const configureS3 = require('../config/aws');
const s3 = configureS3();

const getPreSignedUrl = async (
  AWSBucket,
  AWSPrefix,
  AWSFilename,
  operation
) => {
  const AWSKey = (AWSPrefix ? AWSPrefix : '') + AWSFilename;
  const s3Params = {
    Bucket: AWSBucket,
    Key: AWSKey,
  };

  try {
    const url = await s3.getSignedUrlPromise(operation, s3Params);
    return url;
  } catch (error) {
    console.error('There was an error getting accessing s3');
    return null;
  }
};

module.exports = getPreSignedUrl;
