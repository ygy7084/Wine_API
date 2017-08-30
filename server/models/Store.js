import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Store = new Schema({
  id_vintage : {type : Schema.type.ObjectId, ref : 'Vintage'},
  id_shop : {type : Schema.type.ObjectId, ref : 'Shop'},
  id_customer : {type : Schema.type.ObjectId, ref : 'Customer'},
  datetime : {type : Date},
  quantity_change : {type : Number}
});


const model = mongoose.model('Store', Store);

export default model;
