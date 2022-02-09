const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const axios = require('axios');
const { verifyToken, isAdmin } = require('../../middleware/auth');

const Photo = require('../../models/Photo');
const Album = require('../../models/Album');
const Library = require('../../models/Library');

const router = express.Router();

// @route   GET api/albums
// @desc    Get all albums and presigned-urls of thumbnail photo
// @access  Public
router.get('/', [verifyToken], async (req, res) => {
  try {
    const albums = await Album.find().sort().populate('thumbnailPhoto');
    return res.json(albums);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route   GET api/albums/:album_id
// @desc    Get an album
// @access  Public
router.get('/:album_id', async (req, res) => {
  try {
    let album = await Album.findById(req.params.album_id).populate('photos', [
      '-albums',
    ]);
    if (!album) {
      return res.status(404).json({ errors: [{ msg: 'Invalide album id' }] });
    }
    return res.json(album);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route   POST api/albums
// @desc    Create an album
// @access  Public
router.post(
  '/',
  [verifyToken, isAdmin, check('name', 'name is required').not().isEmpty()],
  async (req, res) => {
    const { name, description, thumbnailPhoto } = req.body;

    // validate post body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check that a album with same name doesn't already exist
      let album = await Album.find({ $or: [{ name }] });
      if (album.length) {
        return res.status(400).json({
          errors: [{ msg: 'Album with that name already exists' }],
        });
      }

      // create new album object
      const albumFields = { name };
      if (description) albumFields.description = description;
      if (thumbnailPhoto) albumFields.thumbnailPhoto = thumbnailPhoto;
      album = new Album(albumFields);

      await album.save();
      res.json(album);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   PUT api/albums/:album_id/:photo_id
// @desc    Add a photo to the end of an album
// @access  Public
// TODO what if one DB query succeeds and one fails? Sagas or something...
router.put('/:album_id/:photo_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    // ensure valid paramters
    const testAlbum = await Album.findById(req.params.album_id);
    const testPhoto = await Photo.findById(req.params.photo_id);
    if (!testAlbum) {
      return res.status(404).json({ errors: [{ msg: 'Invalid album ID' }] });
    }
    if (!testPhoto) {
      return res.status(404).json({ errors: [{ msg: 'Invalid photo ID' }] });
    }

    // update Album
    const album = await Album.findByIdAndUpdate(
      req.params.album_id,
      { $addToSet: { photos: req.params.photo_id } },
      { new: true }
    );

    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.photo_id,
      { $addToSet: { albums: req.params.album_id } },
      { new: true }
    );

    return res.json(album);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

// @route   DELETE api/albums/:album_id/:photo_id
// @desc    Remove a photo from an album
// @access  Public
router.delete(
  '/:album_id/:photo_id',
  [verifyToken, isAdmin],
  async (req, res) => {
    try {
      const photoId = new mongoose.Types.ObjectId(req.params.photo_id);

      // delete photo from album.photos[]
      const album = await Album.findByIdAndUpdate(
        req.params.album_id,
        {
          $pull: { photos: { $in: [photoId] } },
        },
        { new: true }
      );

      // delete album from photo.albums[]
      const albumId = new mongoose.Types.ObjectId(req.params.album_id);
      await Photo.findByIdAndUpdate(req.params.photo_id, {
        $pull: { albums: { $in: [albumId] } },
      });

      return res.json(album);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   PATCH api/albums/:album_id
// @desc    Update a field inside an album
// @access  Public
router.patch('/:album_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    // update Album
    const album = await Album.findByIdAndUpdate(
      req.params.album_id,
      { $set: req.body },
      { new: true }
    );
    return res.json(album);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

// @route   POST api/albums/:album_id/photos/reorder
// @desc    Reorder an albums photos
// @access  Public
router.post(
  '/:album_id/edit/photos/reorder',
  [
    verifyToken,
    isAdmin,
    check('photoIds', 'photoIds (array of photo Ids) is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    // validate post body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await Album.findByIdAndUpdate(req.params.album_id, {
        photos: req.body.photoIds,
      });
      return res.sendStatus(200);
    } catch (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }
  }
);

// @route   DELETE api/albums/:album_id
// @desc    Delete an album
// @access  Public
router.delete('/:album_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.album_id);
    await Library.findOneAndUpdate(
      {
        name: 'default',
      },
      {
        $pull: { albums: { $in: [req.params.album_id] } },
      },
      { new: true }
    );
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   GET api/albums/:album_id/index/:photo_index
// @desc    Get a photo in an album by its index
// @access  Public
router.get('/:album_id/index/:photo_index', async (req, res) => {
  try {
    let album = await Album.findById(req.params.album_id);

    // if no photo at that index exists
    const nPhotos = album.photos.length;
    if (nPhotos <= 0 || req.params.photo_index >= nPhotos) {
      return res.status(404).json({ nPhotos });
    }

    let photoId = album.photos[req.params.photo_index];
    let photo = await Photo.findById(photoId);
    return res.json({ ...photo.toObject(), nPhotos });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

// @route   GET api/albums/name/:album_name
// @desc    Get an album by its name
// @access  Public
router.get('/name/:album_name', async (req, res) => {
  try {
    let album = await Album.findOne({
      name: req.params.album_name,
    })
      .populate('thumbnailPhoto')
      .populate('photos', ['-albums']);
    res.json(album);
  } catch (error) {
    console.error(error);
    return res.status(500).send('No album with that name');
  }
});

// @route   GET api/albums/name/:album_name/:index
// @desc    Get a photo by its album name and index
// @access  Public
router.get('/name/:album_name/:index', async (req, res) => {
  try {
    let album = await Album.findOne({
      name: req.params.album_name,
    });

    // if no photo at that index exists
    const nPhotos = album.photos.length;
    if (nPhotos <= 0 || req.params.index >= nPhotos) {
      return res.status(404).json({ nPhotos });
    }

    let photoId = album.photos[req.params.index];
    let photo = await Photo.findById(photoId);
    return res.json({ ...photo.toObject(), nPhotos });
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

module.exports = router;
