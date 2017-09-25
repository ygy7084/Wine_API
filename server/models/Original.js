import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Original = new Schema({
  eng_fullname: String,
  eng_shortname: String,
  kor_fullname: String,
  kor_shortname: String,
  category: String,
  country: String,
  region: String,
  subregion: String,
  desc: String,
  photo_url: String,
  grape_race: [String],
  locationString: String,
  grapeString: String,
});

const model = mongoose.model('original', Original);

export default model;
