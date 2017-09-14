import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  name : String,
  code : String,
  phone : String
});

Shop.index({code:1}, {unique:true});
const model = mongoose.model('shop', Shop);

export default model;
