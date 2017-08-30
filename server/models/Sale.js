import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sale = new Schema({
  _id : {type : Schema.type.ObjectId},
  code : {type : String, unique : true},
  id_vintage : {type : Schema.type.ObjectID, ref : 'Vintage'},
  id_shop : {type : Schema.type.ObjectID, ref : 'Shop'},
  price : {type : Number}
});


const model = mongoose.model('Sale', Sale);

export default model;
