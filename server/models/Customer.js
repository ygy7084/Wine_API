import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Customer = new Schema({
  name : {type : String},
  phone : {type : String},
  email : {type : String}
});

Customer.index({phone:1}, {unique:true, sparse:true});
Customer.index({email:1}, {unique:true, sparse:true});

const model = mongoose.model('customer', Customer);

export default model;
