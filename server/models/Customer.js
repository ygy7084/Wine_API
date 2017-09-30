import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Customer = new Schema({
  name: String,
  phone: String,
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
  email: String,
  grade: String,
  address: String,
  webAddress: String,
});

Customer.index({ phone: 1, shop: 1 }, { unique: true });

const model = mongoose.model('customer', Customer);

export default model;
