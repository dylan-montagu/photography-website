const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  AWSBucket: {
    type: String,
    required: true,
  },
  AWSPrefix: {
    type: String,
  },
  AWSFilenameSmall: {
    type: String,
    required: true,
  },
  AWSFilenameMedium: {
    type: String,
    required: true,
  },
  AWSFilenameLarge: {
    type: String,
  },
  AWSFilenameThumbnail: {
    type: String,
  },
  dateTaken: {
    type: Date,
  },
  urlSmall: {
    type: String,
    required: true,
  },
  urlMedium: {
    type: String,
    required: true,
  },
  urlLarge: {
    type: String,
  },
  urlThumbnail: {
    type: String,
  },
  cdnUrl: {
    type: String,
    required: true,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'album',
    },
  ],
});

module.exports = Photo = mongoose.model('photo', PhotoSchema);
