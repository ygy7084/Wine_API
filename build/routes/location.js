'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Location을 만든다.
router.post('/', function (req, res) {
  var location = new _models.Location(req.body.data);
  location.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '장소 생성 에러 : 같은 데이터가 있습니다.' });
    }

    return res.json({
      data: results
    });
  });
});
router.get('/all', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Location.find().lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Location Read Error - ' + err.message });
    }

    res.json({
      data: results
    });
  });
});

// Location 삭제한다.
router.delete('/', function (req, res) {
  _models.Location.remove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Sale Delete Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

exports.default = router;