const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'album',
    },
  ],
});

module.exports = Library = mongoose.model('library', LibrarySchema);
