const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const mongoose = require('mongoose');

const Album = require('../../models/Album');
const Photo = require('../../models/Photo');

// @route   GET api/albums
// @desc    Get all albums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().sort();
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
    const album = await Album.findById(req.params.album_id).populate('photos', [
      'name',
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
  [check('name', 'name is required').not().isEmpty()],
  async (req, res) => {
    const { name, description } = req.body;

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
router.put('/:album_id/:photo_id', async (req, res) => {
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
// @desc    Delete a photo from an album
// @access  Public
router.delete('/:album_id/:photo_id', async (req, res) => {
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
});

// @route   PATCH api/albums/:album_id/photos/reorder
// @desc    Reorder photos inside an album
// @access  Public
router.patch('/:album_id/edit/photos/reorder', async (req, res) => {
  const { photoId, destinationIndex } = req.body;

  try {
    const id = new mongoose.Types.ObjectId(photoId);

    // remove photo from array
    await Album.findByIdAndUpdate(req.params.album_id, {
      $pull: { photos: { $in: [id] } },
    });

    // insert into desired index
    const album = await AlbumAlbumView.findByIdAndUpdate(
      req.params.album_id,
      {
        $push: { photos: { $each: [id], $position: destinationIndex } },
      },
      { new: true }
    );

    return res.json(albumView);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

// @route   DELETE api/albums/:album_id
// @desc    Delete an album
// @access  Public
router.delete('/:album_id', async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.album_id);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   PATCH api/albums/:album_id/edit/set-thumbnail
// @desc    Set thumbnail photo
// @access  Public
// TODO what if one DB query succeeds and one fails? Sagas or something...
router.patch(
  '/:album_id/edit/set-thumbnail',
  [check('thumbnailPhoto', 'thumbnail photo_id is required').not().isEmpty()],
  async (req, res) => {
    // validate post body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // // ensure valid paramters
      // const testAlbum = await Album.findById(req.params.album_id);
      // if (!testAlbum) {
      //   return res.status(404).json({ errors: [{ msg: 'Invalid album ID' }] });
      // }

      // update Album
      const album = await Album.findByIdAndUpdate(
        req.params.album_id,
        { thumbnailPhoto: req.body.thumbnailPhoto },
        { new: true }
      );

      return res.json(album);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

module.exports = router;
