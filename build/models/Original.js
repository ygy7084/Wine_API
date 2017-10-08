'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Original = new Schema({
  eng_fullname: String,
  eng_shortname: String,
  kor_fullname: String,
  kor_shortname: String,
  category: String,
  country: String,
  region: String,
  subregion: String,
  desc: String,
  photo_url: String,
  grape_race: [String],
  locationString: String,
  grapeString: String
});

var model = _mongoose2.default.model('original', Original);

exports.default = model;