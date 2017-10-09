'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

require('isomorphic-fetch');

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 서버와 포트 초기화


// api 라우트 로드


// 서버사이드 ajax를 위한 fetch
var app = (0, _express2.default)();

// 초기 계정


// 인증

var port = _configure2.default.PORT;

// 몽고디비 연결 설정
var db = _mongoose2.default.connection;
_mongoose2.default.connect(_configure2.default.MONGO_URL, {
  useMongoClient: true
});

// Mongoose 모듈의 Promise 변경 - 모듈 권고사항 (deprecated)
_mongoose2.default.Promise = global.Promise;

// 몽고디비 연결
db.on('error', console.error);
db.once('open', function () {
  console.log('[MONGO DB URL] : ' + _configure2.default.MONGO_URL);
  _models.Account.find({}).lean().exec(function (err, result) {
    if (err) {
      console.log('DB ERROR', err);
    } else if (result.length === 0) {
      var account = new _models.Account({ username: '0', password: '0', name: '초기관리자' });
      account.save(function (err) {
        if (err) {
          console.log('Error while inserting First Manager', err);
        }
        console.log('[First Manager Account Inserted] username: 0, passowrd: 0');
        return null;
      });
    } else {
      return null;
    }
  });
});

console.log('[STATIC] : ' + _path2.default.join(__dirname, './../public'));

//정적 파일 라우트
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));

/*
const whitelist = ['http://localhost:3000', 'http://localhost'];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);

      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
*/
// 쿠키 사용
app.use((0, _cookieParser2.default)());

// POST 연결을 위한 설정
app.use(_bodyParser2.default.urlencoded({ extended: true, limit: '5mb' }));
app.use(_bodyParser2.default.json({ limit: '5mb' }));
app.enable('trust proxy');

app.get('/cside', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});
var sessionConfig = {
  secret: _configure2.default.SECRET,
  resave: false,
  saveUninitialized: false
};
app.use((0, _expressSession2.default)(sessionConfig));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use(_auth2.default);

// // API 라우트
app.use('/api', _routes2.default);

// index 라우팅
app.get('/*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

// 404 에러
app.use(function (req, res) {
  res.status(404).send('NOT FOUND');
});

// 서버 시작
app.listen(port, function () {
  console.log('Server is listening on this port : ' + port);
});