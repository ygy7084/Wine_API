import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Shop = new Schema({
  _id : {type : Schema.type.ObjectId},
  code : {type : String, unique : true},
  name : {type : String}
});


const model = mongoose.model('Shop', Shop);

export default model;
