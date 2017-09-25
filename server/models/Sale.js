import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Sale = new Schema({
  vintage: { type: Schema.Types.ObjectId, ref: 'vintage' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
  price: Number,
  lowestPrice: Number,
});

Sale.index({ vintage: 1, shop: 1 }, { unique: true });

const model = mongoose.model('sale', Sale);

export default model;
