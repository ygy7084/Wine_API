'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  _models.Location.find({}).lean().exec(function (err, results) {
    if (err) {
      return res.status(500).json({ message: '원산지 조회 에러 : 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Location을 만든다.
router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'country') || !(0, _modules.isObjectHasValidString)(req.body.data, 'region') || !(0, _modules.isObjectHasValidString)(req.body.data, 'subregion')) {
    return res.status(500).json({ message: '원산지 생성 에러 : 빈칸이 있습니다.' });
  }
  var location = new _models.Location({
    country: req.body.data.country,
    region: req.body.data.region,
    subregion: req.body.data.subregion
  });
  location.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '원산지 생성 에러 : 같은 데이터가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Location 삭제한다.
router.delete('/', function (req, res) {
  _models.Location.findOneAndRemove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '원산지 삭제 에러 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// Location 삭제한다.
router.delete('/all', function (req, res) {
  _models.Location.deleteMany({}, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '원산지 삭제 에러 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

exports.default = router;