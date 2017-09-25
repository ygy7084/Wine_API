// var Wine = require('./wine_model');
const mongoose = require('mongoose');
// var wine = require('./wine_model');
// DB 객체를 위한 변수 선언
let database;

// Wine 스키마 객체를 위한 변수 선언
let VintageSchema;

// 몽고디비 연결
const MONGO_URL = 'mongodb://localhost:27017';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
  useMongoClient: true,
});
const db = mongoose.connection;

db.on('error', console.error);
db.on('open', () => {
  console.log(`MongoDB is connected : ${MONGO_URL}`);

  // Vintage 스키마 정의
  VintageSchema = mongoose.Schema({
    id_wine: { type: mongoose.Schema.Types.ObjectId, ref: 'wine' },
    vintage: Number,
    price_wholesale: Number,
  });
  console.log('Vintage스키마 정의함.');

  VintageSchema.index({ _id: 1 }, { unique: true });
  // WineModel 모델 정의
  const VintageModel = mongoose.model('vintage', VintageSchema);
  console.log('VintageModel 정의함.');


  // Wine 추가
  const Vin1 = new VintageModel({
    id_wine: '59b9ed1dc56cc31b989c36f5',
    vintage: 1992,
    price_wholesale: 20000,
  });
  const Vin2 = new VintageModel({
    id_wine: '59b9e89048f4001818ba7d53',
    vintage: 1994,
    price_wholesale: 30000,
  });
  const Vin3 = new VintageModel({
    id_wine: '59b9e89048f4001818ba7d53',
    vintage: 1996,
    price_wholesale: 40000,
  });
  const Vin4 = new VintageModel({
    id_wine: '59b9e89048f4001818ba7d53',
    vintage: 1998,
    price_wholesale: 50000,
  });


  Vin1.save((err) => {
    if (err) {
    // callback(err,null);
      return;
    }
    console.log('Vin1 데이터 추가함');
    // callback(null, user);
  });

  Vin2.save((err) => {
    if (err) {
      return;
    }
    console.log('Vin2 데이터 추가함');
  });

  Vin3.save((err) => {
    if (err) {
      return;
    }
    console.log('Vin3 데이터 추가함');
  });

  Vin4.save((err) => {
    if (err) {
      return;
    }
    console.log('Vin4 데이터 추가함');
  });


  const num = 1;
  const page = 1;

  /* VintageModel.find().populate('id_wine').skip(num*page).limit(Number(num)).lean().exec((err, results) => {
       if(err) {
           console.error(err);
           return res.status(500).json({message:'Vintage Read Error - '+err.message});
       }
       else {
         VintageModel.count({},function(err, c){
           return console.log({
               data : results,
               size : c
           });
         });
       }
   }); */


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
