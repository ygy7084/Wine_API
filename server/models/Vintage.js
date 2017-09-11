import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Vintage = new Schema({
  id_wine : {type : Schema.Types.ObjectId, ref : 'wine'},
  vintage : Number,
  price_wholesale : Number
});

Vintage.index({_id:1}, {unique:true});

const model = mongoose.model('vintage', Vintage);

export default model;
