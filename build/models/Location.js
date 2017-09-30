'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Location = new Schema({
  country: String,
  region: String,
  subregion: String
});

Location.index({ country: 1, region: 1, subregion: 1 }, { unique: true });

var model = _mongoose2.default.model('location', Location);

exports.default = model;