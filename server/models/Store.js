import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Store = new Schema({
  _id : {type : Schema.type.ObjectId},
  id_vintage : {type : Schema.type.ObjectID, ref : 'Vintage'},
  id_shop : {type : Schema.type.ObjectID, ref : 'Shop'},
  id_customer : {type : Schema.type.ObjectID, ref : 'Customer'},
  datetime : {type : Date},
  quantity_change : {type : Number}
});


const model = mongoose.model('Store', Store);

export default model;
