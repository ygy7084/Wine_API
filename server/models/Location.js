import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Location = new Schema({
  country: String,
  region: String,
  subregion: String,
});

Location.index({ country: 1, region: 1, subregion: 1 }, { unique: true });

const model = mongoose.model('location', Location);

export default model;
