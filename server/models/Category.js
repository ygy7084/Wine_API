import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Category = new Schema({
  name : {type : String}
});

Category.index({name:1}, {unique:true});

const model = mongoose.model('category', Category);

export default model;
