import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  name : String,
  id : String,
  password : String,
  phone : String
});

Shop.index({_id:1}, {unique:true});
const model = mongoose.model('shop', Shop);

export default model;
