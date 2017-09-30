'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _models = require('../models');

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// shop 추가.
router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'name')) {
    return res.status(500).json({ message: '매장 생성 에러: 올바른 값을 입력하십시요.' });
  }
  var shop = new _models.Shop({
    name: req.body.data.name,
    phone: req.body.data.phone,
    memo: req.body.data.memo
  });
  shop.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '매장 생성 에러: 중복된 이름이 존재하거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// shop 전체 조회 --> 매장리스트와, 전체 매장 수 반환
router.get('/all/:id', function (req, res) {
  _models.Shop.find({
    _id: req.params.id
  }).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'shop Read Error - ' + err.message });
    }
    return res.json({
      data: results
    });
  });
});

// shop 전체 조회 --> 매장리스트와, 전체 매장 수 반환
router.get('/all', function (req, res) {
  _models.Shop.find().lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'shop Read Error - ' + err.message });
    }
    return res.json({
      data: results
    });
  });
});

// 매장 입고 와인 조회  --> Store에서 해당 매장 자료들을 추출해 populate 함
router.get('/list/wine/:id_shop', function (req, res) {
  _models.Store.find({ id_shop: req.params.id_shop }).populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop', 'id_customer']).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Shop Read Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// shop 개별 조회(_id)
router.get('/list/:_id', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Shop.find({ _id: req.params._id }).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'shop Read Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// shop 수정
router.put('/', function (req, res) {
  if (!Object.prototype.hasOwnProperty.call(req.body.data, 'name')) {
    return res.status(500).json({ message: '매장 수정 오류: 올바른 값을 입력하십시요.' });
  }
  var properties = ['name', 'phone', 'memo'];
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

  _models.Shop.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '매장 수정 오류: 중복된 이름이 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// shop 삭제
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: 'shop 삭제 오류: _id가 전송되지 않았습니다.' });
  }

  var SaleBulk = [];
  var ShopBulk = [];
  var StoreBulk = [];
  var CustomerBulk = [];

  ShopBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });

  _async2.default.waterfall([function (cb) {
    console.log('1');

    _models.Sale.find({
      shop: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = result[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var obj = _step2.value;

          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('2');

    _models.Customer.find({
      shop: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = result[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var obj = _step3.value;

          CustomerBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('3');

    _models.Store.find({
      shop: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = result[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var obj = _step4.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('4');
    _models.Store.bulkWrite(StoreBulk, function (StoreBulkResult) {
      _models.Customer.bulkWrite(CustomerBulk, function (CustomerBulkResullt) {
        _models.Sale.bulkWrite(SaleBulk, function (saleBulkResult) {
          _models.Shop.bulkWrite(ShopBulk, function (ShopBulkResult) {
            cb(null);
          });
        });
      });
    });
  }], function () {
    console.log('5');

    return res.json({
      data: true
    });
  });

  // Sale.remove({ id_shop: req.body.data._id }, (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: `related Sale Delete Error while deleting Shop- ${err.message}` });
  //   }
  //
  //   Store.updateMany({ id_shop: req.body.data._id }, { $set: { id_shop: null } }, (err, updateresult) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).json({ message: `related Store modify error${err.message}` });
  //     }
  //
  //     Shop.remove({ _id: req.body.data._id }, (err, callback) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).json({ message: `shop Delete Error - ${err.message}` });
  //       }
  //
  //       return res.json(callback);
  //     });
  //   });
  // });
});

router.delete('/all', function (req, res) {
  var SaleBulk = [];
  var ShopBulk = [];
  var CustomerBulk = [];
  var StoreBulk = [];
  /*OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });*/

  _async2.default.waterfall([function (cb) {
    console.log('0');
    _models.Shop.find({}, function (err, result) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = result[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var obj = _step5.value;

          ShopBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('1');

    _models.Sale.find({
      shop: { $in: ShopBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = result[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var obj = _step6.value;

          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('2');

    _models.Customer.find({
      shop: { $in: ShopBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = result[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var obj = _step7.value;

          CustomerBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('Store delete');

    _models.Store.find({
      shop: { $in: ShopBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = result[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var obj = _step8.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('3');
    _models.Store.bulkWrite(StoreBulk, function (storeBulkResult) {
      _models.Customer.bulkWrite(CustomerBulk, function (customerBulkResult) {
        _models.Sale.bulkWrite(SaleBulk, function (saleBulkResult) {
          _models.Shop.bulkWrite(ShopBulk, function (shopBulkResult) {
            cb(null);
          });
        });
      });
    });
  }], function () {
    console.log('4');

    return res.json({
      data: true
    });
  });
});

exports.default = router;