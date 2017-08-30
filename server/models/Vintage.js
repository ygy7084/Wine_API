import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Vintage = new Schema({
  _id : {type : Schema.type.ObjectId},
  code : {type : String, Unique : true},
  id_wine : {type : Schema.type.ObjectID, ref : 'Wine'},
  vintage : {type : String}
});


const model = mongoose.model('Vintage', Vintage);

export default model;
