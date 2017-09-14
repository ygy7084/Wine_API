import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Store = new Schema({
  id_vintage : {type : Schema.type.ObjectId, ref : 'vintage'},
  id_shop : {type : Schema.type.ObjectId, ref : 'shop'},
  id_customer : {type : Schema.type.ObjectId, ref : 'customer'},
  datetime : Date,
  quantity_change : Number,
  storage : String,
  wine_name : String,
  wine_vintage : Number,
  shop_name : String
});

Store.index({_id:1}, {unique:true});

const model = mongoose.model('store', Store);

export default model;
