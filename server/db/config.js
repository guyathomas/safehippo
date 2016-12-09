const mongoose = require('mongoose');
const dangers = require('../data');
const DangerArea = require('./models/DangerArea');

mongoose.connection.on('open', () => {
  console.log('mongoose connection open');
});
mongoose.connection.on('disconnected', () => {
  console.log('mongoose connection closed');
});


const db = mongoose.connect('mongodb://127.0.0.1:27017/dangerDataDB');

// Populate the database with incidents from SFOpenData
const populateDB = function () {
  DangerArea.collection.drop();
  dangers.forEach((danger) => {
    const newDanger = DangerArea({
      lat: danger.location.coordinates[0],
      lon: danger.location.coordinates[1],
    });
    console.log(newDanger);
    newDanger.save();
  });
  mongoose.disconnect();
};

populateDB();
