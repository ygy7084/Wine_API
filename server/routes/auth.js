import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import { Account, CustomerBase, Configuration, } from '../models';
import {
  isObjectHasValidString,
  email,
}
  from './modules';

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
passport.use('manager',new LocalStrategy((username, password, done) => {
  Account.findOne({ username }, (err, account) => {
    if (err) { return done(err); }
    if (!account) {
      return done(null, false, { message: 'Incorrect Username.' });
    }
    if (account.password !== password) {
      return done(null, false, { message: 'Incorrect Password.' });
    }
    return done(null, account);
  });
}));
passport.use('customer',new LocalStrategy((username, password, done) => {
  CustomerBase.findOne({ phone: username, password }, (err, customer) => {
    if (err) { return done(err); }
    if (!customer) {
      return done(null, false, { message: '잘못된 계정 정보입니다.' });
    }
    return done(null, customer);
  });
}));
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
// [END setup]

// [START authorize]
router.post('/auth/login', (req, res, next) => {
  passport.authenticate('manager', (err, account, info) => {
    if (err) res.status(500).json(err);
    if (!account) { return res.status(400).json(info.message); }
    req.logIn(account, (err) => {
      if (err) { return next(err); }
      return res.json({
        data: account,
      });
    });
  })(req, res, next);
});

router.post('/auth/customerlogin', (req, res, next) => {
  passport.authenticate('customer', (err, account, info) => {
    if (err) res.status(500).json(err);
    if (!account) { return res.status(400).json(info.message); }
    req.logIn(account, (err) => {
      if (err) { return next(err); }
      return res.json({
        data: account,
      });
    });
  })(req, res, next);
});
router.post('/auth/findpassword', (req, res) => {
  if (!req.body.data.phone) {
    return res.status(500).json({ message: '전화번호가 전달되지 않았습니다.' });
  }
  Configuration.findOne({})
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '설정 조회 오류: 오류가 있습니다.' });
      }
      if (req.body.data.phone === 'thisistestphonenumber') {
        email(
          result.email.host,
          result.email.pwd,
          req.body.data.to,
          result.email.title,
          result.email.content.replace('%password%', '123456789'),
        )
          .then(() => {
            return res.json({data: {success: true}});
          })
          .catch((e) => {
            return res.status(500).json({message: '이메일 로그인이 안되거나 이메일에 에러가 있습니다.'});
          })
      }
      else {
        CustomerBase.findOne({ phone: req.body.data.phone })
          .exec((err, customer) => {
            if (err) {
              return res.status(500).json({ message: '고객 조회 오류: 오류가 있습니다.' });
            }
            if (!customer.email || customer.email === '') {
              return res.status(500).json({ message: '이메일 정보가 없습니다. 직접 문의하십시요.' });
            }
            email(
              result.email.host,
              result.email.pwd,
              customer.email,
              result.email.title,
              result.email.content.replace('%password%', customer.password),
            )
              .then(() => {
                return res.json({data: {success: true}});
              })
              .catch((e) => {
                return res.status(500).json({message: '이메일 전송에 에러가 있습니다. 직접 문의하십시요.'});
              })
          })
      }
    });
});router.post('/auth/customerprelogin', (req, res) => {
  if (!isObjectHasValidString(req.body.data, 'phone')) {
    return res.status(500).json({ message: '전화번호를 입력하십시요.' });
  }
  CustomerBase.findOne({
    phone: req.body.data.phone,
  })
    .exec((err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '네트워크 에러가 있습니다.' });
      }
      if (!result) {
        return res.status(500).json({ message: '전화번호에 연결된 계정이 없습니다.' });
      } else {
        if (result.password === 'thisisdefaultpassword') {
          req.logIn(result, (err) => {
            if(err) { console.error(err); res.status(500).json({ message: '로그인에 실패하였습니다.' })}
            return res.json({ data: { customer: result, initialLogin: true } });
          })
        } else {
          return res.json({ data: { initialLogin: false } });
        }
      }
    });
});
router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    return res.send({
      data: true,
    });
  });
});

router.get('/auth', (req, res) => {
  // If user is not stored in session, it will return undefined.
  if (!req.user || !(req.user.level === '관리자' || req.user.level === '매장')) {
    return res.status(400).json({ message: '로그인하십시요.', behavior: 'redirectToLogin' });
  }
  req.user.cookie = req.headers.cookie;
  // If user connect again within 5min from last connection,
  // the expiration time is renewed.
  return res.json({ data: req.user });
});
router.get('/customerauth', (req, res) => {
  // If user is not stored in session, it will return undefined.
  if (!req.user || req.user.level === '관리자' || req.user.level === '매장') {
    return res.status(400).json({ message: '로그인하십시요.', behavior: 'redirectToLogin' });
  }
  req.user.cookie = req.headers.cookie;
  // If user connect again within 5min from last connection,
  // the expiration time is renewed.
  return res.json({ data: req.user });
});

router.use((req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
});

export default router;
