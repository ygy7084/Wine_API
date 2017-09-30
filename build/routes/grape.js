'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Grape을 만든다.
router.post('/', function (req, res) {
  var grape = new _models.Grape(req.body.data);
  grape.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'grape Create Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// Grape 삭제한다.
router.delete('/', function (req, res) {
  _models.Grape.remove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Grape Delete Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

exports.default = router;