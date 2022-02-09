const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const { connectDB, initializeDB } = require('./config/db');

// configure express app
const app = express();
app.use(express.static('public'));
app.use(express.json({ extended: false }));
connectDB();
initializeDB();

app.use('/api/photos', require('./routes/api/photos'));
app.use('/api/albums', require('./routes/api/albums'));
// app.use('/api/aws', require('./routes/api/aws'));
app.use('/api/library', require('./routes/api/library'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static files from the React app
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  // have to serve file with every request for react routing to work
  app.get('*', (req, res) => {
    res.sendFile('index.html', {
      root: path.join(__dirname, '../client/build'),
    });
  });
}

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
