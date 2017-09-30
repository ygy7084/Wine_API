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

// const Customer = new Schema({
//   name: String,
//   phone: String,
//   email: String,
//   grade: Number,
//   address: String,
// });
// Customer를 만든다.
router.post('/', function (req, res) {
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'name') || !(0, _modules.isObjectHasValidString)(req.body.data, 'phone')) {
    return res.status(500).json({ message: '고객 생성 오류: 이름과 전화번호는 필수입니다.' });
  }
  _models.Customer.findOne({ phone: req.body.data.phone }).lean().exec(function (err, result) {
    if (result) {
      var customer = new _models.Customer({
        name: req.body.data.name,
        phone: req.body.data.phone,
        shop: req.body.data.shop,
        email: req.body.data.email,
        address: req.body.data.address,
        webAddress: result.webAddress
      });
      customer.save(function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
        }

        return res.json({
          data: results
        });
      });
    } else {
      var _customer = new _models.Customer({
        name: req.body.data.name,
        phone: req.body.data.phone,
        shop: req.body.data.shop,
        email: req.body.data.email,
        address: req.body.data.address
      });
      _customer.save(function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
        }
        _models.Customer.findOneAndUpdate({ _id: result._id }, {
          $set: { webAddress: String(result._id) }
        }, function (err, result) {
          if (err) {
            return res.status(500).json({ message: '고객 생성 오류: 생성 과정에 오류가 있습니다.' });
          }
          return res.json({
            data: result
          });
        });
      });
    }
  });
});

router.get('/all/:id', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Customer.find({
    shop: req.params.id
  }).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'customer(individual) find Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

router.get('/all', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Customer.find({}).populate('shop').exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'customer(individual) find Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// Customer을 수정한다.
router.put('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 수정 오류: _id가 전송되지 않았습니다.' });
  }
  if (!(0, _modules.isObjectHasValidString)(req.body.data, 'name') || !(0, _modules.isObjectHasValidString)(req.body.data, 'phone')) {
    return res.status(500).json({ message: '고객 수정 오류: 전화번호와 이름은 필수입니다.' });
  }
  var properties = ['name', 'phone', 'email', 'address'];
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

  _models.Customer.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Customer Modify Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});
router.delete('/all/:id', function (req, res) {
  _models.Customer.deleteMany({
    shop: req.params.id
  }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '고객 삭제 오류: 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});
router.delete('/all', function (req, res) {
  _models.Customer.deleteMany({}, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cus' });
    }
    return res.json({
      data: results
    });
  });
});
router.delete('/', function (req, res) {
  _models.Customer.findOneAndRemove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cus' });
    }
    return res.json({
      data: results
    });
  });
});
// Customer 삭제
// router.delete('/', (req, res) => {
//   Store.remove({ id_customer: req.body.data._id }, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: `Customer Delete Error - ${err.message}` });
//     }
//
//     Customer.remove({ _id: req.body.data._id }, (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Cus' });
//       }
//       return res.json({
//         data: results,
//       });
//     });
//   });
// });

exports.default = router;