// like photo.js, but hooked into AWS
const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');

const getPreSignedUrl = require('../../util/aws');
const Photo = require('../../models/Photo');
const Album = require('../../models/Album');
const resizeOptimizeImages = require('../../util/resizeOptimizeImages');
const { verifyToken, isAdmin } = require('../../middleware/auth');

const router = express.Router();
const upload = multer({ dest: './public/uploads/' });
const configureS3 = require('../../config/aws');
const s3 = configureS3();

// @route   GET api/photos/
// @desc    Get all photos and presigned-urls
// @access  Public
router.get('/', [verifyToken], async (req, res) => {
  try {
    const photos = await Photo.find()
      .sort({ dateUploaded: -1 })
      .limit(parseInt(req.query.limit));
    const returnPhotos = await Promise.all(
      photos.map(async (photo) => {
        const { AWSBucket, AWSPrefix, AWSFilename, AWSFilenameCompressed } =
          photo;
        const url = await getPreSignedUrl(
          AWSBucket,
          AWSPrefix,
          AWSFilename,
          'getObject'
        );
        const urlCompressed = await getPreSignedUrl(
          AWSBucket,
          AWSPrefix,
          AWSFilenameCompressed,
          'getObject'
        );
        if (url) {
          photo = photo.toObject();
          return { ...photo, url, urlCompressed };
        } else {
          console.error('There was an error getting accessing s3');
          return res.sendStatus(500);
        }
      })
    );
    return res.json(returnPhotos);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   GET api/photos/:photo_id
// @desc    Get a photo
// @access  Public
router.get('/:photo_id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photo_id).populate('albums', [
      '-photos',
    ]);
    if (!photo) {
      return res.status(404).json({ errors: [{ msg: 'Invalide photo id' }] });
    }
    return res.json(photo);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

// @route   POST api/photos
// @desc    Create a photo and upload to AWS
// @access  Public
router.post(
  '/',
  [verifyToken, isAdmin, upload.single('image')],
  async (req, res) => {
    const { name, description, dateTaken, albumId } = req.body;
    const AWSPrefix = process.env.AWS_PREFIX;
    const AWSBucket = process.env.AWS_BUCKET;
    const uuid = uuidv4();
    const AWSFilenameSmall = uuid + '-small.jpg';
    const AWSFilenameMedium = uuid + '-medium.jpg';
    const AWSFilenameLarge = uuid + '-large.jpg';
    const AWSFilenameThumbnail = uuid + '-thumbnail.jpg';
    const cdnUrl = process.env.CDN_URL;
    const protocol = 'http://';
    const urlSmall = protocol + cdnUrl + '/' + AWSPrefix + AWSFilenameSmall;
    const urlMedium = protocol + cdnUrl + '/' + AWSPrefix + AWSFilenameMedium;
    const urlLarge = protocol + cdnUrl + '/' + AWSPrefix + AWSFilenameLarge;
    const urlThumbnail =
      protocol + cdnUrl + '/' + AWSPrefix + AWSFilenameThumbnail;

    // AWS
    const smallAWSUploadURL = await getPreSignedUrl(
      AWSBucket,
      AWSPrefix,
      AWSFilenameSmall,
      'putObject'
    );

    const mediumAWSUploadURL = await getPreSignedUrl(
      AWSBucket,
      AWSPrefix,
      AWSFilenameMedium,
      'putObject'
    );

    const largeAWSUploadURL = await getPreSignedUrl(
      AWSBucket,
      AWSPrefix,
      AWSFilenameLarge,
      'putObject'
    );

    const thumbnailAWSUploadURL = await getPreSignedUrl(
      AWSBucket,
      AWSPrefix,
      AWSFilenameThumbnail,
      'putObject'
    );

    // COMPRESS IMAGES
    const filePathSmall = './public/uploads/compressed/' + AWSFilenameSmall;
    const resizeOptionsSmall = {
      images: [req.file.path],
      width: 200,
      quality: 10,
    };
    await resizeOptimizeImages(resizeOptionsSmall, filePathSmall);

    const filePathMedium = './public/uploads/compressed/' + AWSFilenameMedium;
    const resizeOptionsMedium = {
      images: [req.file.path],
      width: 1000,
      quality: 90,
    };
    await resizeOptimizeImages(resizeOptionsMedium, filePathMedium);

    const filePathThumbnail =
      './public/uploads/compressed/' + AWSFilenameThumbnail;
    const resizeOptionsThumbnail = {
      images: [req.file.path],
      width: 200,
      quality: 70,
    };
    await resizeOptimizeImages(resizeOptionsThumbnail, filePathThumbnail);

    // dimentions for DB
    const dimensions = sizeOf(filePathSmall);

    const options = {
      headers: {
        'Content-Type': req.file.mimetype,
      },
    };

    // UPLOAD IMAGES TO AWS
    try {
      fs.readFile(filePathSmall, async (err, file) => {
        if (err) return res.status(500).send('Error opening small file');
        await axios.put(smallAWSUploadURL, file, options);
      });
      fs.readFile(filePathMedium, async (err, file) => {
        if (err) return res.status(500).send('Error opening medium file');
        await axios.put(mediumAWSUploadURL, file, options);
      });
      fs.readFile(req.file.path, async (err, file) => {
        if (err) return res.status(500).send('Error opening large file');
        await axios.put(largeAWSUploadURL, file, options);
      });
      fs.readFile(filePathThumbnail, async (err, file) => {
        if (err) return res.status(500).send('Error opening large file');
        await axios.put(thumbnailAWSUploadURL, file, options);
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('Issue uploading to AWS. Files have not been deleted');
    } finally {
      let unlinkError = false;
      fs.unlink(filePathSmall, (err) => {
        if (err) unlinkError = true;
      });
      fs.unlink(filePathMedium, (err) => {
        if (err) unlinkError = true;
      });
      fs.unlink(req.file.path, (err) => {
        if (err) unlinkError = true;
      });
      fs.unlink(filePathThumbnail, (err) => {
        if (err) unlinkError = true;
      });
      if (unlinkError)
        return res
          .status(500)
          .send('Issue deleting files from local file system');
    }

    // DB
    const photoFields = {
      AWSBucket,
      AWSPrefix,
      AWSFilenameThumbnail,
      AWSFilenameLarge,
      AWSFilenameMedium,
      AWSFilenameSmall,
      urlSmall,
      urlMedium,
      urlLarge,
      urlThumbnail,
      cdnUrl,
    };
    photoFields.name = name ? name : req.file.originalname;
    if (description) photoFields.description = description;
    if (dateTaken) photoFields.dateTaken = dateTaken;

    // try upload photo object with dimentions grabbed from compressed photo, should be correct ratio
    try {
      photoFields.width = dimensions.width;
      photoFields.height = dimensions.height;
      photo = new Photo(photoFields);
      const savedPhoto = await photo.save();
      if (albumId) {
        try {
          // update Album
          const album = await Album.findByIdAndUpdate(
            albumId,
            { $addToSet: { photos: savedPhoto._id } },
            { new: true }
          );

          const updatedPhoto = await Photo.findByIdAndUpdate(
            savedPhoto._id,
            { $addToSet: { albums: album._id } },
            { new: true }
          );
        } catch {
          return res.status(200).send('Photo Uploaded, but not saved to album');
        }
      }
      return res.json(photo);
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .send('Error saving photo to DB. Files are still saved to AWS');
    }
  }
);

// @route   DELETE api/photos/:photo_id
// @desc    Delete photo and its occurances in all albums
// @access  Public
router.delete('/:photo_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photo_id);
    const {
      AWSBucket,
      AWSPrefix,
      AWSFilenameFullSize,
      AWSFilenameSmall,
      AWSFilenameMedium,
      AWSFilenameLarge,
      AWSFilenameThumbnail,
    } = photo;

    if (!photo) console.error("Photo with this ID doesn't exist in DB");
    await Photo.findByIdAndDelete(req.params.photo_id);

    // remove photo_id occurances in albums.photos[]
    const id = mongoose.Types.ObjectId(req.params.photo_id);
    await Album.updateMany({}, { $pull: { photos: { $in: [id] } } });

    let AWSKey = AWSPrefix + AWSFilenameFullSize;
    let params = {
      Bucket: AWSBucket,
      Key: AWSKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        return res.sendStatus(500);
      }
    });

    AWSKey = AWSPrefix + AWSFilenameSmall;
    params = {
      Bucket: AWSBucket,
      Key: AWSKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        return res.sendStatus(500);
      }
    });

    AWSKey = AWSPrefix + AWSFilenameMedium;
    params = {
      Bucket: AWSBucket,
      Key: AWSKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        return res.sendStatus(500);
      }
    });

    AWSKey = AWSPrefix + AWSFilenameLarge;
    params = {
      Bucket: AWSBucket,
      Key: AWSKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        return res.sendStatus(500);
      }
    });

    AWSKey = AWSPrefix + AWSFilenameThumbnail;
    params = {
      Bucket: AWSBucket,
      Key: AWSKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        return res.sendStatus(500);
      }
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   DELETE api/photos
// @desc    Delete all photos
// @access  Public
router.delete('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const photos = await Photo.find({});

    photos.forEach(async (photo) => {
      const {
        AWSBucket,
        AWSPrefix,
        AWSFilenameFullSize,
        AWSFilenameSmall,
        AWSFilenameMedium,
        AWSFilenameLarge,
      } = photo;

      if (!photo) console.error("Photo with this ID doesn't exist in DB");
      await Photo.findByIdAndDelete(photo._id);

      // remove photo_id occurances in albums.photos[]
      const id = mongoose.Types.ObjectId(photo._id);
      await Album.updateMany({}, { $pull: { photos: { $in: [id] } } });

      let AWSKey = AWSPrefix + AWSFilenameFullSize;
      let params = {
        Bucket: AWSBucket,
        Key: AWSKey,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error(err, err.stack);
          return res.sendStatus(500);
        }
      });

      AWSKey = AWSPrefix + AWSFilenameSmall;
      params = {
        Bucket: AWSBucket,
        Key: AWSKey,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error(err, err.stack);
          return res.sendStatus(500);
        }
      });

      AWSKey = AWSPrefix + AWSFilenameMedium;
      params = {
        Bucket: AWSBucket,
        Key: AWSKey,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error(err, err.stack);
          return res.sendStatus(500);
        }
      });

      AWSKey = AWSPrefix + AWSFilenameLarge;
      params = {
        Bucket: AWSBucket,
        Key: AWSKey,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error(err, err.stack);
          return res.sendStatus(500);
        }
      });
    });
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   PATCH api/albums/:photo_id
// @desc    Update a field inside an photo
// @access  Public
router.patch('/:photo_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    // update Album
    const album = await Photo.findByIdAndUpdate(
      req.params.photo_id,
      { $set: req.body },
      { new: true }
    );
    return res.json(album);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
