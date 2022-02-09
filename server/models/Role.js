const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

module.exports = Role = mongoose.model('role', RoleSchema);
