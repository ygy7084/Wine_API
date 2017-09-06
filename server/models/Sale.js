import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sale = new Schema({
  code : String,
  id_vintage : [{type : Schema.type.ObjectId, ref : 'vintage'}],
  id_shop : [{type : Schema.type.ObjectId, ref : 'shop'}],
  price : Number
});

Sale.index({code:1}, {unique:true});

const model = mongoose.model('sale', Sale);

export default model;
