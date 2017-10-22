import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Store = new Schema({
  sale: { type: Schema.Types.ObjectId, ref: 'sale' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
  customer: { type: Schema.Types.ObjectId, ref: 'customer' },
  datetime: Date,
  quantityChange: Number,
  storage: String,
});

const model = mongoose.model('store', Store);

export default model;
