import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  name: String,
  phone: String,
  memo: String,
});

const model = mongoose.model('shop', Shop);

export default model;
