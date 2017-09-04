import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  code : {type : String},
  name : {type : String},
  password : {type : String},
  phone : {type : String}
});

Shop.index({code:1}, {unique:true});
const model = mongoose.model('shop', Shop);

export default model;
