'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Sale = new Schema({
  vintage: { type: Schema.Types.ObjectId, ref: 'vintage' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' },
  price: Number,
  lowestPrice: Number,
  wholeSalePrice: Number
});

Sale.index({ vintage: 1, shop: 1 }, { unique: true });

var model = _mongoose2.default.model('sale', Sale);

exports.default = model;