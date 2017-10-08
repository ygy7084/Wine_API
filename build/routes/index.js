'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _original = require('./original');

var _original2 = _interopRequireDefault(_original);

var _vintage = require('./vintage');

var _vintage2 = _interopRequireDefault(_vintage);

var _sale = require('./sale');

var _sale2 = _interopRequireDefault(_sale);

var _location = require('./location');

var _location2 = _interopRequireDefault(_location);

var _grape = require('./grape');

var _grape2 = _interopRequireDefault(_grape);

var _customer = require('./customer');

var _customer2 = _interopRequireDefault(_customer);

var _customerBase = require('./customerBase');

var _customerBase2 = _interopRequireDefault(_customerBase);

var _shop = require('./shop');

var _shop2 = _interopRequireDefault(_shop);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _account = require('./account');

var _account2 = _interopRequireDefault(_account);

var _excel = require('./excel');

var _excel2 = _interopRequireDefault(_excel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.use('/original', _original2.default);
router.use('/vintage', _vintage2.default);
router.use('/sale', _sale2.default);
router.use('/location', _location2.default);
router.use('/grape', _grape2.default);
router.use('/customer', _customer2.default);
router.use('/customerbase', _customerBase2.default);
router.use('/shop', _shop2.default);
router.use('/store', _store2.default);
router.use('/account', _account2.default);
router.use('/excel', _excel2.default);

exports.default = router;