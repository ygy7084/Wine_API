import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sale = new Schema({
  id_vintage : [{type : Schema.Types.ObjectId, ref : 'vintage'}],
  id_shop : [{type : Schema.Types.ObjectId, ref : 'shop'}],
  price : Number,
  price_lowest : Number
});

Sale.index({_id:1}, {unique:true});

const model = mongoose.model('sale', Sale);

export default model;
