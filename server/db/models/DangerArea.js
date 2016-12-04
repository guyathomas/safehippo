const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

// Define the schema and their columns
const DangerAreaSchema = new mongoose.Schema({
  lon: 'number',
  lat: 'number',
});

// Create a model based on the schema
const DangerArea = mongoose.model('DangerArea', DangerAreaSchema);

module.exports = DangerArea;
