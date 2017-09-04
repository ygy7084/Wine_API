import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Vintage = new Schema({
  code : {type : String},
  id_wine : {type : Schema.type.ObjectId, ref : 'wine'},
  vintage : {type : Number}
});

Vintage.index({code:1}, {unique:true});

const model = mongoose.model('vintage', Vintage);

export default model;
