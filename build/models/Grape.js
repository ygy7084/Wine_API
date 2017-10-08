'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Grape = new Schema({
  name: String
});

Grape.index({ name: 1 }, { unique: true });

var model = _mongoose2.default.model('grape', Grape);

exports.default = model;