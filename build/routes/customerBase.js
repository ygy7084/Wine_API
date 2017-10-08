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

router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'name') || !(0, _modules.isObjectHasValidString)(req.body.data, 'phone')) {
    return res.status(500).json({ message: '고객 생성 오류: 이름과 전화번호는 필수입니다.' });
  }
  var customerBase = void 0;
  customerBase = new _models.CustomerBase({
    name: req.body.data.name,
    phone: req.body.data.phone,
    email: req.body.data.email,
    level: req.body.data.level,
    address: req.body.data.address
  });
  customerBase.save(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
    }
    return res.json({
      data: result
    });
  });
});

router.get('/', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.CustomerBase.find({}).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'customer(individual) find Error - ' + err.message });
    }
    return res.json({
      data: results
    });
  });
});
router.get('/phone/:number', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.CustomerBase.find({}).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'customer(individual) find Error - ' + err.message });
    }
    return res.json({
      data: results
    });
  });
});
router.get('/history/:id', function (req, res) {
  _models.Customer.find({ customerBase: req.params.id }).lean().exec(function (err, result) {
    if (err || !result) {
      res.status(500).json({ message: '에러가 있습니다.' });
    }
    _models.Store.find({
      customer: { $in: result.map(function (obj) {
          return obj._id;
        }) }
    }).sort({ _id: -1 }).populate([{ path: 'sale', populate: { path: 'vintage', populate: { path: 'original' } } }, 'shop', 'customer']).exec(function (err, results) {
      if (err) {
        res.status(500).json({ message: '에러가 있습니다.' });
      }
      res.json({ data: results });
    });
  });
});
router.get('/stored/:id', function (req, res) {
  _models.Customer.find({ customerBase: req.params.id }).lean().exec(function (err, result) {
    if (err || !result) {
      res.status(500).json({ message: '에러가 있습니다.' });
    }
    _models.Store.aggregate([{
      $match: {
        customer: { $in: result.map(function (obj) {
            return obj._id;
          }) }
      }
    }, {
      $group: {
        _id: {
          sale: "$sale",
          shop: "$shop"
        },
        total: { $sum: "$quantityChange" }
      }
    }, {
      $lookup: {
        from: "sales",
        localField: "_id.sale",
        foreignField: "_id",
        as: "sale"
      }
    }, {
      $unwind: "$sale"
    }, {
      $lookup: {
        from: "vintages",
        localField: "sale.vintage",
        foreignField: "_id",
        as: "vintage"
      }
    }, {
      $unwind: "$vintage"
    }, {
      $lookup: {
        from: "originals",
        localField: "vintage.original",
        foreignField: "_id",
        as: "original"
      }
    }, {
      $unwind: "$original"
    }, {
      $lookup: {
        from: "shops",
        localField: "_id.shop",
        foreignField: "_id",
        as: "shop"
      }
    }, {
      $unwind: "$shop"
    }]).exec(function (error, result) {
      return res.json({ data: result.filter(function (obj) {
          return obj.total !== 0;
        }) });
    });
    // Store.find({
    //   customer: { $in: result.map(obj => obj._id)}
    // })
    //   .lean()
    //   .exec((err, result) => {
    //     if (err) {
    //       res.status(500).json({message: '에러가 있습니다.'});
    //     }
    //     res.json({ data: result });
    //   });
  });
});
router.put('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 수정 오류: _id가 전송되지 않았습니다.' });
  }
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'name') || !(0, _modules.isObjectHasValidString)(req.body.data, 'phone')) {
    return res.status(500).json({ message: '고객 수정 오류: 전화번호와 이름은 필수입니다.' });
  }
  var properties = ['name', 'phone', 'email', 'address', 'level', 'accounts'];
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

  _models.CustomerBase.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Customer Modify Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});
router.delete('/all', function (req, res) {
  var CustomerBaseBulk = [];
  var CustomerBulk = [];
  var StoreBulk = [];
  _async2.default.waterfall([function (cb) {
    _models.CustomerBase.find({}, function (err, result) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = result[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var obj = _step2.value;

          CustomerBaseBulk.push({
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
    _models.Customer.find({
      customerBase: { $in: CustomerBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
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
    _models.Store.find({
      customer: { $in: CustomerBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
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
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Customer.bulkWrite(CustomerBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.CustomerBase.bulkWrite(CustomerBaseBulk).then(function (r1) {
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
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: 'Customer 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  var CustomerBaseBulk = [];
  var CustomerBulk = [];
  var StoreBulk = [];

  CustomerBaseBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  _async2.default.waterfall([function (cb) {
    _models.Customer.find({
      customerBase: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = result[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var obj = _step5.value;

          CustomerBulk.push({
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
    _models.Store.find({
      customer: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = result[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var obj = _step6.value;

          StoreBulk.push({
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
    _models.Store.bulkWrite(StoreBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Customer.bulkWrite(CustomerBulk).then(function (r1) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.CustomerBase.bulkWrite(CustomerBaseBulk).then(function (r1) {
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