const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnailPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'photo',
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'photo',
    },
  ],
});

module.exports = Album = mongoose.model('album', AlbumSchema);
