import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Store = new Schema({
  id_vintage : {type : Schema.type.ObjectId, ref : 'vintage'},
  id_shop : {type : Schema.type.ObjectId, ref : 'shop'},
  id_customer : {type : Schema.type.ObjectId, ref : 'customer'},
  datetime : {type : Date},
  quantity_change : {type : Number}
});


const model = mongoose.model('store', Store);

export default model;
