const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const mongoose = require('mongoose');

const getPreSignedUrl = require('../../util/aws');
const { verifyToken, isAdmin } = require('../../middleware/auth');

const Library = require('../../models/Library');

// @route   GET api/library
// @desc    Get all Libraries
// @access  Public
router.get('/', async (req, res) => {
  try {
    const libraries = await Library.find().sort();
    return res.json(libraries);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route   GET api/library/:name
// @desc    Get library by name
// @access  Public
router.get('/name/:name', async (req, res) => {
  try {
    const defaultLibrary = await Library.findOne({
      name: req.params.name,
    }).populate({
      path: 'albums',
      populate: 'thumbnailPhoto',
    });

    return res.json(defaultLibrary);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

// @route   POST api/library
// @desc    Create a library
// @access  Public
router.post(
  '/',
  [verifyToken, isAdmin, check('name', 'name is required').not().isEmpty()],
  async (req, res) => {
    const { name } = req.body;

    // validate post body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check that a library with same name doesn't already exist
      let library = await Library.find({ name });
      if (library.length) {
        return res.status(400).json({
          errors: [{ msg: 'Library with that name already exists' }],
        });
      }

      library = new Library({ name });
      await library.save();
      return res.json(library);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   PUT api/library/:library_id/:album_id
// @desc    Add an album to the end of an a library
// @access  Public
router.put(
  '/:library_id/:album_id',
  [verifyToken, isAdmin],
  async (req, res) => {
    try {
      // update library.albums[]
      const library = await Library.findByIdAndUpdate(
        req.params.library_id,
        { $addToSet: { albums: req.params.album_id } },
        { new: true }
      );

      return res.json(library);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   DELETE api/library/library_id/:album_id
// @desc    Delete an album from a library
// @access  Public
router.delete(
  '/:library_id/:album_id',
  [verifyToken, isAdmin],
  async (req, res) => {
    try {
      // remove photo_id occurances in albums.photos[]
      const id = mongoose.Types.ObjectId(req.params.album_id);
      const library = await Library.findByIdAndUpdate(
        req.params.library_id,
        {
          $pull: { albums: { $in: [id] } },
        },
        { new: true }
      );

      return res.json(library);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   PATCH api/library/:library_id/edit/albums/reorder
// @desc    Reorder albums inside a library
// @access  Public
router.patch(
  '/:library_id/edit/albums/reorder',
  [
    verifyToken,
    isAdmin,
    check('albumId', 'albumId is required').not().isEmpty(),
    check('destinationIndex', 'destinationIndex is required').not().isEmpty(),
  ],
  async (req, res) => {
    const { albumId, destinationIndex } = req.body;

    try {
      const id = new mongoose.Types.ObjectId(albumId);

      // remove album from array
      await Library.findByIdAndUpdate(req.params.library_id, {
        $pull: { albums: { $in: [id] } },
      });

      // insert
      const library = await Library.findByIdAndUpdate(
        req.params.library_id,
        {
          $push: { albums: { $each: [id], $position: destinationIndex } },
        },
        { new: true }
      );

      return res.json(library);
    } catch (error) {
      console.error(error.message);
      return res.sendStatus(500);
    }
  }
);

// @route   DELETE api/library/:library_id
// @desc    Delete a library
// @access  Public
router.delete('/:library_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    await Library.findByIdAndDelete(req.params.library_id);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// @route   PATCH api/library/:library_id
// @desc    Update a field inside a library
// @access  Public
router.patch('/:library_id', [verifyToken, isAdmin], async (req, res) => {
  try {
    // update Library
    const library = await Library.findByIdAndUpdate(
      req.params.library_id,
      { $set: req.body },
      { new: true }
    );
    return res.json(library);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
