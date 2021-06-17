import * as mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: Number,
  lon: Number
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
