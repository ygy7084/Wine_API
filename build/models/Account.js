'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Account = new _mongoose2.default.Schema({
  username: String,
  password: String,
  name: String,
  level: { type: String, default: '관리자' },
  shop: { type: Schema.Types.ObjectId, ref: 'shop' }
});

Account.index({ username: 1 }, { unique: true });

var model = _mongoose2.default.model('account', Account);

exports.default = model;