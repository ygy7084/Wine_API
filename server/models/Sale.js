import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sale = new Schema({
  code : {type : String, unique : true},
  id_vintage : {type : Schema.type.ObjectId, ref : 'Vintage'},
  id_shop : {type : Schema.type.ObjectId, ref : 'Shop'},
  price : {type : Number}
});


const model = mongoose.model('Sale', Sale);

export default model;
