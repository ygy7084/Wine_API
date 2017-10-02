'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Shop = new Schema({
  name: String,
  phone: String,
  memo: String
});

var model = _mongoose2.default.model('shop', Shop);

exports.default = model;