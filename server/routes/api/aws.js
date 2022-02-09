const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const configureS3 = require('../../config/aws');

const router = express.Router();
const s3 = configureS3();
const upload = multer({ dest: './public/uploads/' });
const { verifyToken, isAdmin } = require('../../middleware/auth');

// @route   POST api/aws/get-object-url
// @desc    Get presigned url of requested object (bucket, key provided)
// @access  Public
router.post('/get-object-url', async (req, res) => {
  const { bucket, key } = req.body;
  const s3Params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', s3Params);
    return res.json({ url });
  } catch (error) {
    console.error('There was an error getting accessing s3');
    return res.sendStatus(500);
  }
});

// @route   POST api/aws/get-objects
// @desc    List objects at <bucket>/<prefix>/
// @access  Public
router.post('/get-objects', async (req, res) => {
  const { bucket, prefix } = req.body;
  const params = {
    Bucket: bucket,
    Prefix: prefix,
    Delimiter: '/',
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error(err, err.stack);
      return res.sendStatus(500);
    } else {
      return res.json({ data });
    }
  });
});

// @route   POST api/aws/get-presigned-urls
// @desc    Return a list of pre-signed urls of all objects at a location (bucket/prefix)
// @access  Public
router.post('/get-presigned-urls', (req, res) => {
  const { bucket, prefix } = req.body;
  const params = {
    Bucket: bucket,
    Prefix: prefix,
    Delimiter: '/',
  };

  s3.listObjectsV2(params, async (err, data) => {
    if (err) {
      console.error(err, err.stack);
      return res.sendStatus(500);
    }

    // get rid of empty prefix object
    const objects = data.Contents.filter((object) => object.Size !== 0);

    // Allows an array of promises to be returned as a single promise
    const presignedUrls = await Promise.all(
      objects.map(async (object) => {
        let presignedParams = {
          Bucket: bucket,
          Key: object.Key,
        };
        try {
          const url = await s3.getSignedUrlPromise(
            'getObject',
            presignedParams
          );
          return url;
        } catch (error) {
          console.error('There was an error getting accessing s3');
          return res.sendStatus(500);
        }
      })
    );

    res.json({ presignedUrls });
  });
});

/* 
Brief overview of how upload works
Clieht has an `input element` for the upload
Button's on click will run uploadObject function
This will create a formData object, a key-value object
It saves the desired bucket under a bucket field
It saves the file data under `image`. To access the file directly, it uses
a react hook useRef, which directly access the DOM's elements. I believe you 
coudl also access this directly via e.target.elt or osmething like that. 

Form data is posted to server. 
Due to multer configuration, the value specified in `upload.single(<key>)` is a reference
to the object in the form data to uplaod to local file system. 
Note that the key specified here, and the key specified in teh form data must match. 
Will also see that in many demos ononline, they use the form<submit> function, in which case
the key specified in multer should match the client side input element's Name. 

Multer will automatically save the file to ./public/uploads (configured at top under dest). 
Multer alos allows configuration of what to name file - reference documentation for more info. 
req.body contains values in the formData stored at key field
req.file stores metadata about the file uploaded (specified in upload.single), including
what file apth it's at, original name, size, etc. 

We use this data to get presigned Url. 
Then we make put request to presigned-url, referencing the file directly via filePath
which identify via file metadata retrieved above (coudl also probably do something like
./public/uploads/${FILE_NAME}) or something. 
That shoudl work. 
Then we delete the file from local FS using fs.unlink.  

Some example linkes (coudlnt' find the OG link I used for this framework)
https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
https://js.plainenglish.io/uploading-files-using-multer-on-server-in-nodejs-and-expressjs-5f4e621ccc67
*/

// @route   POST upload-object
// @desc    Upload an object to s3
// @access  Public
router.post('/upload-object', upload.single('image'), async (req, res) => {
  const bucket = req.body.bucket;
  const key = req.file.originalname;

  const s3Params = {
    Bucket: bucket,
    Key: key,
    Expires: 300,
  };

  let signedUrl;
  try {
    signedUrl = await s3.getSignedUrlPromise('putObject', s3Params);
  } catch (error) {
    return res.status(500).send('Signed URL Error');
  }

  const options = {
    headers: {
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'png',
    },
  };

  fs.readFile(req.file.path, async (err, file) => {
    if (err) return res.status(500).send('Error opening file');

    try {
      await axios.put(signedUrl, file, options);
      res.status(200).json({
        msg: '[' + key + '] successfully uploaded',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Issue uploading image');
    } finally {
      fs.unlink(req.file.path, (err) => {
        if (err) return console.error(err);
      });
    }
  });
  return;
});

module.exports = router;
