'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var LocalStrategy = _passportLocal2.default.Strategy;
_passport2.default.use('manager', new LocalStrategy(function (username, password, done) {
  _models.Account.findOne({ username: username }, function (err, account) {
    if (err) {
      return done(err);
    }
    if (!account) {
      return done(null, false, { message: 'Incorrect Username.' });
    }
    if (account.password !== password) {
      return done(null, false, { message: 'Incorrect Password.' });
    }
    return done(null, account);
  });
}));
_passport2.default.use('customer', new LocalStrategy(function (username, password, done) {
  _models.CustomerBase.findOne({ phone: username }, function (err, customer) {
    if (err) {
      return done(err);
    }
    if (!customer) {
      return done(null, false, { message: '잘못된 전화번호' });
    }
    return done(null, customer);
  });
}));
_passport2.default.serializeUser(function (user, cb) {
  cb(null, user);
});
_passport2.default.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
// [END setup]

// function authRequired(req, res, next) {
//   if (!req.user) {
//     req.session.oauth2return = req.originalUrl;
//     return res.redirect('/auth/login');
//   }
//   next();
// }

// [START authorize]
router.post('/auth/login', function (req, res, next) {
  _passport2.default.authenticate('manager', function (err, account, info) {
    if (err) res.status(500).json(err);
    if (!account) {
      return res.status(400).json(info.message);
    }
    req.logIn(account, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        data: account
      });
    });
  })(req, res, next);
});

router.post('/auth/customerlogin', function (req, res, next) {
  _passport2.default.authenticate('customer', function (err, account, info) {
    if (err) res.status(500).json(err);
    if (!account) {
      return res.status(400).json(info.message);
    }
    req.logIn(account, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        data: account
      });
    });
  })(req, res, next);
});

router.get('/auth/logout', function (req, res) {
  req.session.destroy(function () {
    res.clearCookie('connect.sid');
    return res.send({
      data: true
    });
  });
});

router.get('/auth', function (req, res) {
  // If user is not stored in session, it will return undefined.
  if (!req.user) {
    return res.status(400).json({ message: '로그인하십시요.', behavior: 'redirectToLogin' });
  }
  req.user.cookie = req.headers.cookie;
  // If user connect again within 5min from last connection,
  // the expiration time is renewed.
  return res.json({ data: req.user });
});

router.use(function (req, res, next) {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
});

exports.default = router;