import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  code : String,
  name : String,
  password : String,
  phone : String
});

Shop.index({code:1}, {unique:true});
const model = mongoose.model('shop', Shop);

export default model;
