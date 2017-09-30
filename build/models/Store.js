'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Store = new Schema({
  sale: { type: Schema.Types.ObjectId, ref: 'sale' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
  customer: { type: Schema.Types.ObjectId, ref: 'customer' },
  datetime: Date,
  quantityChange: Number,
  storage: String,
  wineName: String,
  wineVintage: Number,
  wineShop: String
});

var model = _mongoose2.default.model('store', Store);

exports.default = model;