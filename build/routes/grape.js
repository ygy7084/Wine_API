'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  _models.Grape.find({}).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 조회 오류 : 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Grape을 만든다.
router.post('/', function (req, res) {
  var grape = new _models.Grape({
    name: req.body.data.name
  });
  grape.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 생성 오류 : 중복된 품종이 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Grape 삭제한다.
router.delete('/', function (req, res) {
  _models.Grape.findOneAndRemove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 삭제 오류 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Grape 삭제한다.
router.delete('/all', function (req, res) {
  _models.Grape.deleteMany({}, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 삭제 오류 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
exports.default = router;