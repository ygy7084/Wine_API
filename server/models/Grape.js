import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Location = new Schema({
  name : {type : String, unique : true}
});


const model = mongoose.model('Grape', Grape);

export default model;
