const mongoose = require('mongoose');
const Role = require('../models/Role');

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(error.message);
    // exit process with error
    process.exit(1);
  }
};

const initializeDB = async () => {
  const documentCount = await Role.estimatedDocumentCount();
  if (documentCount === 0) {
    const adminRole = new Role({ name: 'admin' });
    await adminRole.save();

    const adminDemoRole = new Role({ name: 'adminDemo' });
    await adminDemoRole.save();
  }
};

module.exports = { connectDB, initializeDB };
