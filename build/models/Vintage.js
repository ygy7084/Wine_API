'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Vintage = new Schema({
  original: { type: Schema.Types.ObjectId, ref: 'original' },
  vintage: Number
});

Vintage.index({ original: 1, vintage: 1 }, { unique: true });

var model = _mongoose2.default.model('vintage', Vintage);

exports.default = model;