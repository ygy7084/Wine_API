import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Customer = new Schema({
  name : {type : String},
  phone : {type : String, unique : true, sparse : true },
  email : {type : String, unique : true, sparse : true }
});


const model = mongoose.model('Customer', Customer);

export default model;
