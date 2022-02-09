const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const configureS3 = require('../../config/aws');

const Photo = require('../../models/Photo');
const Album = require('../../models/Album');

const router = express.Router();
const s3 = configureS3();
const upload = multer({ dest: './public/uploads/' });

// @route   POST api/photos
// @desc    Create a photo
// @access  Public
router.post(
  '/',
  [
    check('AWSBucket', 'AWS Bucket is required').not().isEmpty(),
    check('AWSFilename', 'AWS Filename is required').not().isEmpty(),
  ],
  async (req, res) => {
    const {
      name,
      description,
      AWSBucket,
      AWSPrefix,
      AWSFilename,
      dateTaken,
    } = req.body;

    // validate post body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // check that a photo with same prefix/filename doesn't already exist
    let photo = await Photo.findOne({ AWSBucket, AWSPrefix, AWSFilename });
    if (photo) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Photo already exists' }] });
    }

    // Update DB: create new photo object
    const photoFields = { AWSBucket, AWSFilename };
    if (AWSPrefix) photoFields.AWSPrefix = AWSPrefix;
    if (name) photoFields.name = name;
    if (description) photoFields.description = description;
    if (dateTaken) photoFields.dateTaken = dateTaken;
    photo = new Photo(photoFields);

    // save photo to DB
    try {
      await photo.save();
      return res.json(photo);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   GET api/photos
// @desc    Get all photos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ dateUploaded: -1 });
    return res.json(photos);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   DELETE api/photos/:photo_id
// @desc    Delete photo and its occurances in all albums
// @access  Public
router.delete('/:photo_id', async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.photo_id);

    // remove photo_id occurances in albums.photos[]
    const id = mongoose.Types.ObjectId(req.params.photo_id);
    await Album.updateMany({}, { $pull: { photos: { $in: [id] } } });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
