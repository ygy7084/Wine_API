import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Customer = new Schema({
  name: String,
  phone: String,
  email: { type: String, default: '' },
  password: { type: String, default: 'thisisdefaultpassword' },
  level: { type: String, default: '1' },
  address: String,
});

Customer.index({ phone: 1 }, { unique: true });

const model = mongoose.model('customerbase', Customer);

export default model;
