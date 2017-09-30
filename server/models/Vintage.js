import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Vintage = new Schema({
  original: { type: Schema.Types.ObjectId, ref: 'original' },
  vintage: Number,
});

Vintage.index({ original: 1, vintage: 1 }, { unique: true });

const model = mongoose.model('vintage', Vintage);

export default model;
