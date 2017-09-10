import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Customer = new Schema({
  name : String,
  phone : String,
  email : String
});

Customer.index({phone:1}, {unique:true});
Customer.index({email:1}, {unique:true});
Customer.index({phone:1, email:1}, {unique:true});

const model = mongoose.model('customer', Customer);

export default model;
