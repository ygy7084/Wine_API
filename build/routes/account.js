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

// 계정 생성
router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'username') || !(0, _modules.isObjectHasValidString)(req.body.data, 'password')) {
    return res.status(500).json({ message: '계정 생성 오류: 아이디와 비밀번호를 입력해주십시요.' });
  }
  var accountTemp = {
    username: req.body.data.username,
    password: req.body.data.password,
    name: req.body.data.name,
    level: req.body.data.level,
    shop: req.body.data.shop
  };
  var account = new _models.Account(accountTemp);
  account.save(function (err, result) {
    if (err) {
      return res.status(500).json({ message: '계정 생성 오류: 중복된 아이디가 존재하거나 오류가 있습니다.' });
    }
    return res.json({
      data: result
    });
  });
  return null;
});

// 계정 반환
router.get('/:_id', function (req, res) {
  _models.Account.findOne({ _id: req.params._id }).lean().exec(function (err, result) {
    if (err) {
      return res.status(500).json({ message: '계정 조회 오류: 검색에 오류가 있습니다.' });
    }
    return res.json({
      data: result
    });
  });
});

// 계정 리스트 반환
router.get('/', function (req, res) {
  _models.Account.find({}).populate('shop').exec(function (err, result) {
    if (err) {
      return res.status(500).json({ message: '계정 리스트 조회 오류: 검색에 오류가 있습니다.' });
    }
    return res.json({
      data: result
    });
  });
});

// 계정 수정
router.put('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '계정 수정 오류: _id가 전송되지 않았습니다.' });
  }
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'username') || !(0, _modules.isObjectHasValidString)(req.body.data, 'password')) {
    return res.status(500).json({ message: '계정 수정 오류: 아이디와 비밀번호를 입력해주십시요.' });
  }
  var properties = ['username', 'password', 'name', 'level', 'shop'];
  var update = { $set: {} };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
        update.$set[property] = req.body.data[property];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  _models.Account.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, result) {
    if (err) {
      return res.status(500).json({ message: '계정 수정 오류: 아이디가 중복되거나 에러가 발생했습니다.' });
    }
    return res.json({
      data: result
    });
  });
  return null;
});

// 계정 삭제
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '계정 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  _models.Account.findOneAndRemove({ _id: req.body.data._id }, function (err, result) {
    return res.json({
      data: result
    });
  });
  return null;
});

// 계정 전부 삭제
router.delete('/all', function (req, res) {
  _models.Account.deleteMany({}, function (err) {
    if (err) {
      return res.status(500).json({ message: '계정 삭제 오류: DB 삭제에 문제가 있습니다.' });
    }
    var account = new _models.Account({
      username: '0',
      password: '0',
      name: '초기관리자'
    });
    account.save(function (err, result) {
      if (err) {
        return res.status(500).json({ message: '계정 삭제 오류: 초기 관리자 계정 생성에 문제가 있습니다. 수동으로 DB를 접속하십시요.' });
      }
      return res.json({
        data: result
      });
    });
  });
  return null;
});

exports.default = router;