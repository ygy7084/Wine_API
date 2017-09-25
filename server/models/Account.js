import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Account = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  level: { type: String, default: '관리자' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
});

Account.index({ username: 1 }, { unique: true });

const model = mongoose.model('account', Account);

export default model;
