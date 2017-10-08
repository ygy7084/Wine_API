'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Customer = new Schema({
  name: String,
  phone: String,
  email: String,
  level: { type: String, default: '1' },
  address: String,
  accounts: Array
});

Customer.index({ phone: 1 }, { unique: true });

var model = _mongoose2.default.model('customerbase', Customer);

exports.default = model;