import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import mongoose from 'mongoose';
import MongoConnect from 'connect-mongo';
import configure from './configure';

// 서버사이드 ajax를 위한 fetch
import 'isomorphic-fetch';

// 인증
import auth from './routes/auth';

// api 라우트 로드
import api from './routes';

// 초기 계정
import { Account, Configuration } from './models';

// 서버와 포트 초기화
const app = express();
const port = configure.PORT;

// 몽고디비 연결 설정
const db = mongoose.connection;
mongoose.connect(configure.MONGO_URL, {
  useMongoClient: true,
});

// Mongoose 모듈의 Promise 변경 - 모듈 권고사항 (deprecated)
mongoose.Promise = global.Promise;

// 몽고디비 연결
db.on('error', console.error);
db.once('open', () => {
  console.log(`[MONGO DB URL] : ${configure.MONGO_URL}`);
  Account.find({}).lean().exec((err, result) => {
    if (err) {
      console.log('DB ERROR', err);
    } else if (result.length === 0) {
      const account = new Account({ username: '0', password: '0', name: '초기관리자' });
      account.save((err) => {
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
  Configuration.find({}).lean().exec((err, result) => {
    if (err) {
      console.log('DB ERROR', err);
    } else if (result.length === 0) {
      const configuration = new Configuration({
        email: {
          host: 'mywinecellars@gmail.com',
          pwd: 'cavistes',
          title: 'MyCellar - 비밀번호 찾기 결과입니다.',
          content: '안녕하십니까. MyCellar입니다. 비밀번호는 %password%입니다.',
        },
      });
      configuration.save((err) => {
        if (err) {
          console.log('Error while inserting Configuration', err);
        }
        console.log('[First Configuration Inserted] email: mywinecellars@gmail.com // pwd: cavistes');
        return null;
      });
    } else {
      return null;
    }
  });
});

console.log('[STATIC] : ' + path.join(__dirname, './../public'));

//정적 파일 라우트
app.use('/', express.static(path.join(__dirname, './../public')));


// 쿠키 사용
app.use(cookieParser());

// POST 연결을 위한 설정
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.enable('trust proxy');

const MongoStore = MongoConnect(session);
const sessionConfig = {
  secret: configure.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(auth);

// // API 라우트
app.use('/api', api);

// index 라우팅
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// 404 에러
app.use((req, res) => {
  res.status(404).send('NOT FOUND');
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is listening on this port : ${port}`);
});
