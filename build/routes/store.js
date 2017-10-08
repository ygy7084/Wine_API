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

// Store 추가.
router.post('/', function (req, res) {
  if (!req.body.data.sale || !req.body.data.shop || !req.body.data.customer) {
    return res.status(500).json({ message: '입출고 생성 에러: 입력에 오류가 있습니다.' });
  }
  var store = new _models.Store({
    sale: req.body.data.sale,
    shop: req.body.data.shop,
    customer: req.body.data.customer,
    datetime: new _modules.Datetime(new Date()).dateObject,
    quantityChange: req.body.data.quantityChange,
    storage: req.body.data.storage,
    wineName: req.body.data.wineName,
    wineVintage: req.body.data.wineVintage,
    wineShop: req.body.data.wineShop
  });
  store.save(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store Create Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// 입출고내역 조회 (매장별)
router.get('/list/:id_shop', function (req, res) {
  _models.Store.find({ id_shop: req.params.id_shop }).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store(by shop) find error' + err.message });
    }

    if (results) {
      res.json(results);
    }
  });
});

// 입출고내역 전체 조회.
router.get('/list', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Store.find().lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store(all) find Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});
// 입출고내역 전체 조회.
router.get('/all/:id', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Store.find({ shop: req.params.id }).populate([{ path: 'sale', populate: { path: 'vintage', populate: { path: 'original' } } }, 'shop', 'customer']).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store(all) find Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// 입출고내역 전체 조회.
router.get('/all', function (req, res) {
  _models.Store.find({}).populate([{ path: 'sale', populate: { path: 'vintage', populate: { path: 'original' } } }, 'shop', 'customer']).exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store(all) find Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});

// 입출고내역 수정
router.put('/', function (req, res) {
  _models.Store.update({ _id: req.body.data._id }, { $set: req.body.data }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store Modify Error - ' + err.message });
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
  _models.Store.insertMany(arr.map(function (obj) {
    return {
      sale: obj.sale,
      shop: obj.shop,
      customer: obj.customer,
      datetime: new _modules.Datetime(new Date()).dateObject,
      quantityChange: obj.quantityChange,
      storage: obj.storage,
      wineName: obj.wineName,
      wineVintage: obj.wineVintage,
      wineShop: obj.wineShop
    };
  }), function (err, docs) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store Insert Error - ' + err.message });
    }
    return res.json({
      data: docs
    });
  });
});
// Stoer 삭제
router.delete('/', function (req, res) {
  _models.Store.remove({ _id: req.body.data._id }, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store Delete Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});
// Stoer 삭제
router.delete('/all', function (req, res) {
  _models.Store.deleteMany({}, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Store Delete Error - ' + err.message });
    }
    return res.json({
      data: results
    });
  });
});

exports.default = router;