// var Wine = require('./wine_model');
const mongoose = require('mongoose');

// DB 객체를 위한 변수 선언
let database;

// Wine 스키마 객체를 위한 변수 선언
let WineSchema;

// 몽고디비 연결
const MONGO_URL = 'mongodb://localhost:27017/';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  useMongoClient: true,
});
const db = mongoose.connection;

db.on('error', console.error);
db.on('open', () => {
  console.log(`MongoDB is connected : ${MONGO_URL}`);

  // Wine 스키마 정의
  WineSchema = mongoose.Schema({
    eng_fullname: String,
    eng_shortname: String,
    kor_fullname: String,
    kor_shortname: String,
    category: String,
    country: String,
    region: String,
    subregion: String,
    desc: String,
    photo_url: String,
    grape_race: [{ name: String }],
  });
  console.log('WineSchema 정의함.');

  WineSchema.index({ _id: 1 }, { unique: true });
  // WineModel 모델 정의
  const WineModel = mongoose.model('wine', WineSchema);
  console.log('WineModel 정의함.');


  // Wine 추가
  const Wine1 = new WineModel({
    eng_fullname: 'kaABC',
    eng_shortname: 'kaABC',
    kor_fullname: 'kaABC',
    kor_shortname: 'kaABC',
    category: 'kaABC',
    country: 'kaABC',
    region: 'kaABC',
    subregion: 'kaABC',
    desc: 'kaABCDe',
    photo_url: 'kaABC',
    grape_race: [{ name: 'kaABCDEf' }],
  });

  const Wine2 = new WineModel({
    eng_fullname: 'kaABC2',
    eng_shortname: 'kaABC2',
    kor_fullname: 'kaABC2',
    kor_shortname: 'kaABC2',
    category: 'kaABC2',
    country: 'kaABC2',
    region: 'kaABC2',
    subregion: 'kaABC2',
    desc: 'kaABCDe2',
    photo_url: 'kaABC2',
    grape_race: [{ name: 'kaABCDEf2' }],
  });

  const Wine3 = new WineModel({
    eng_fullname: 'kaABC3',
    eng_shortname: 'kaABCd3',
    kor_fullname: 'kaABC3',
    kor_shortname: 'kaABC3',
    category: 'kaABC3',
    country: 'kaABC3',
    region: 'kaABC3',
    subregion: 'kaABC3',
    desc: 'kaABCDe3',
    photo_url: 'kaABC3',
    grape_race: [{ name: 'kaABCDEf3' }],
  });

  const Wine4 = new WineModel({
    eng_fullname: '4kaABC3',
    eng_shortname: '4kaABCd3',
    kor_fullname: '4kaABC3',
    kor_shortname: '4kaABC3',
    category: '4kaABC3',
    country: '4kaABC3',
    region: '4kaABC3',
    subregion: '4kaABC3',
    desc: '4kaABCDe3',
    photo_url: '4kaABC3',
    grape_race: [{ name: '4kaABCDEf3' }],
  });

  const Wine5 = new WineModel({
    eng_fullname: '54kaABC3',
    eng_shortname: '54kaABCd3',
    kor_fullname: '54kaABC3',
    kor_shortname: '54kaABC3',
    category: '54kaABC3',
    country: '54kaABC3',
    region: '54kaABC3',
    subregion: '54kaABC3',
    desc: '54kaABCDe3',
    photo_url: '54kaABC3',
    grape_race: [{ name: '54kaABCDEf3' }],
  });


  Wine1.save((err) => {
    if (err) {
    // callback(err,null);
      return;
    }
    console.log('Wine1 데이터 추가함');
    // callback(null, user);
  });

  Wine2.save((err) => {
    if (err) {
      return;
    }
    console.log('Wine2 데이터 추가함');
  });

  Wine3.save((err) => {
    if (err) {
      return;
    }
    console.log('Wine3 데이터 추가함');
  });

  Wine4.save((err) => {
    if (err) {
      return;
    }
    console.log('Wine4 데이터 추가함');
  });

  /* Wine5.save(function(err){
     if(err){
       return;
     }
     console.log('Wine5 데이터 추가함');
   }); */
  WineModel.remove({ _id: '59b6d132657ab308f0d11e76' }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Wine Delete Error - ${err.message}` });
    }

    return console.log('wine5 deleted');
  });

// console.log(Wine1.code);
// console.log(Wine1.desc);
// console.log(Wine1.grape_race);


/*
//num개의 와인을 num*page + 1 번째 부터 조회한다.

const num = 3;
const page = 2;

model.find().lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return console.log({message:'Wine Read Error - '+err.message});
    }
    else {
        return console.log (results);     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
            //total : model.size()   // 이렇게 쓰는게 맞는 것인가.
        };
        console.log(results);

});

/*
//와인을 조회한다.
router.get('/api/wine/list', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Wine.find().limit(20).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Wine Read Error - '+err.message});
        }
        else {
            return res.json({
                data : [results],     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
            });
        }
    });
});
*/
});
