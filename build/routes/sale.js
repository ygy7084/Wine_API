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

// sale을 만든다.
router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidProp)(req.body.data, 'vintage') || !(0, _modules.isObjectHasValidProp)(req.body.data, 'shop') || !(0, _modules.isObjectHasValidProp)(req.body.data, 'wholeSalePrice')) {
    return res.status(500).json({ message: '상품 생성 오류: 올바른 값을 입력하십시요.' });
  }
  var sale = new _models.Sale({
    vintage: req.body.data.vintage,
    shop: req.body.data.shop,
    price: req.body.data.price,
    lowestPrice: req.body.data.lowestPrice,
    wholeSalePrice: req.body.data.wholeSalePrice
  });
  sale.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 생성 오류: 중복된 상품가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// 입출고내역 대량 입력
router.post('/bulk', function (req, res) {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '입출고 입력 오류: 값이 존재하지 않습니다.' });
  }
  var arr = req.body.data;
  _models.Sale.insertMany(arr.map(function (obj) {
    return {
      vintage: obj.vintage,
      shop: obj.shop,
      price: obj.price ? obj.price : 0,
      lowestPrice: obj.lowestPrice ? obj.lowestPrice : 0,
      wholeSalePrice: obj.wholeSalePrice ? obj.wholeSalePrice : 0
    };
  }), function (err, docs) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'sale Insert Error - ' + err.message });
    }
    return res.json({
      data: docs
    });
  });
});
// num개의 sale를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', function (req, res) {
  var num = req.params.num;
  var page = req.params.page;

  _models.Sale.find().populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop']).skip(num * page).limit(Number(num)).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Sale Read Error - ' + err.message });
    }

    _models.Sale.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});
// sale을 조회한다(조건x 20개).
router.get('/list', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Sale.find().populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop']).limit(20).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'sale Read Error - ' + err.message });
    }

    _models.Sale.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});

// sale 전체 조회
router.get('/all/:id', function (req, res) {
  _models.Sale.find({
    shop: req.params.id
  }).populate([{ path: 'vintage', populate: { path: 'original' } }, 'shop']).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 조회 오류: 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// sale 전체 조회
router.get('/all', function (req, res) {
  _models.Sale.find({}).populate([{ path: 'vintage', populate: { path: 'original' } }, 'shop']).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 조회 오류: 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
// sale을 수정한다.
router.put('/bulk', function (req, res) {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '상품 수정 오류: 값이 존재하지 않습니다.' });
  }
  var bulkUpdateArr = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = req.body.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var obj = _step.value;

      bulkUpdateArr.push({
        updateOne: {
          filter: { _id: obj._id },
          update: {
            price: obj.price,
            lowestPrice: obj.lowestPrice,
            wholeSalePrice: obj.wholeSalePrice
          }
        }
      });
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

  _models.Sale.bulkWrite(bulkUpdateArr).then(function (result) {
    return res.json({ data: result });
  });
});
// sale을 수정한다.
router.put('/', function (req, res) {
  if (!Object.prototype.hasOwnProperty.call(req.body.data, 'vintage') || !Object.prototype.hasOwnProperty.call(req.body.data, 'shop')) {
    return res.status(500).json({ message: '상품 생성 오류: 올바른 값을 입력하십시요.' });
  }
  var properties = ['vintage', 'shop', 'price', 'lowestPrice', 'wholeSalePrice'];
  var update = { $set: {} };
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var property = _step2.value;

      if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
        update.$set[property] = req.body.data[property];
      }
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

  _models.Sale.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 수정 오류: 중복된 상품이 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// sale 삭제한다.
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: 'Sale 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  var SaleBulk = [];
  var StoreBulk = [];
  SaleBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  _async2.default.waterfall([function (cb) {
    _models.Store.find({
      sale: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = result[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var obj = _step3.value;

          StoreBulk.push({
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
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r2) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    return res.json({
      data: true
    });
  });
});

//
router.delete('/bulk', function (req, res) {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '상품 삭제 오류: 값이 존재하지 않습니다.' });
  }
  var SaleBulk = [];
  var StoreBulk = [];
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = req.body.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var obj = _step4.value;

      SaleBulk.push({
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

  _async2.default.waterfall([function (cb) {
    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = result[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _obj = _step5.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: _obj._id }
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
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r2) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    return res.json({
      data: true
    });
  });
});
router.delete('/all/:id', function (req, res) {
  var SaleBulk = [];
  var StoreBulk = [];
  _async2.default.waterfall([function (cb) {
    _models.Sale.find({
      shop: req.params.id
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
    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = result[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var obj = _step7.value;

          StoreBulk.push({
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
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r2) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    return res.json({
      data: true
    });
  });
});
// sale 삭제한다.
router.delete('/all', function (req, res) {
  var SaleBulk = [];
  var StoreBulk = [];
  _async2.default.waterfall([function (cb) {
    _models.Sale.find({}, function (err, result) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = result[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var obj = _step8.value;

          SaleBulk.push({
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
    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = result[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var obj = _step9.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r2) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    return res.json({
      data: true
    });
  });
});

exports.default = router;