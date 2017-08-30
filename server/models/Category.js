import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Location = new Schema({
  _id : {type : Schema.type.ObjectId},
  name : {type : String, unique : true}
});


const model = mongoose.model('Category', Category);

export default model;
