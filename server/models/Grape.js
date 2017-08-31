import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Grape = new Schema({
  name : {type : String}
});

Grape.index({name:1}, {unique:true});

const model = mongoose.model('grape', Grape);

export default model;
