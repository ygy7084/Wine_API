var mongoose = require('mongoose')

// DB 객체를 위한 변수 선언
var database;

var Wine = require('../models').Wine;
var Vintage = require('../models').Vintage;
var Shop = require('../models').Shop;
var Customer = require('../models').Customer;
var Store = require('../models').Store;

//몽고디비 연결
var MONGO_URL = 'mongodb://localhost:27017/';

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL,{
  useMongoClient: true,
});
const db = mongoose.connection;

db.on('error', console.error);
db.on('open', () => {
   console.log('MongoDB is connected : '+MONGO_URL);


   // Wine 추가
   var Wine1 = new Wine({
     "eng_fullname" : "1check",
     "eng_shortname" : "1check",
     "kor_fullname" : "1check",
     "kor_shortname" : "1check",
     "category" : "1check",
     "country" : "1check",
     "region" : "1check",
     "subregion" : "1check",
     "desc" : "1check",
     "photo_url" : "1check",
     "grape_race" : [{name : "1check"}]
   });
   var Wine2 = new Wine({
     "eng_fullname" : "2check",
     "eng_shortname" : "2check",
     "kor_fullname" : "2check",
     "kor_shortname" : "2check",
     "category" : "2check",
     "country" : "2check",
     "region" : "2check",
     "subregion" : "2check",
     "desc" : "2check",
     "photo_url" : "2check",
     "grape_race" : [{name : "2check"}]
   });
   var Wine3 = new Wine({
     "eng_fullname" : "3check",
     "eng_shortname" : "3check",
     "kor_fullname" : "3check",
     "kor_shortname" : "3check",
     "category" : "3check",
     "country" : "3check",
     "region" : "3check",
     "subregion" : "3check",
     "desc" : "3check",
     "photo_url" : "3check",
     "grape_race" : [{name : "3check"}]
   });
   var Wine4 = new Wine({
     "eng_fullname" : "4check",
     "eng_shortname" : "4check",
     "kor_fullname" : "4check",
     "kor_shortname" : "4check",
     "category" : "4check",
     "country" : "4check",
     "region" : "4check",
     "subregion" : "4check",
     "desc" : "4check",
     "photo_url" : "4check",
     "grape_race" : [{name : "4check"}]
   });
   var Wine5 = new Wine({
     "eng_fullname" : "5check",
     "eng_shortname" : "5check",
     "kor_fullname" : "5check",
     "kor_shortname" : "5check",
     "category" : "5check",
     "country" : "5check",
     "region" : "5check",
     "subregion" : "5check",
     "desc" : "5check",
     "photo_url" : "5check",
     "grape_race" : [{name : "5check"}]
   });

   Wine1.save(function(err){
     if(err){
       return;
     }
     console.log('Wine1 데이터 추가함');
   });
   Wine2.save(function(err){
     if(err){
       return;
     }
     console.log('Wine2 데이터 추가함');
   });
   Wine3.save(function(err){
     if(err){
       return;
     }
     console.log('Wine3 데이터 추가함');
   });
   Wine4.save(function(err){
     if(err){
       return;
     }
     console.log('Wine4 데이터 추가함');
   });
   Wine5.save(function(err){
     if(err){
       return;
     }
     console.log('Wine5 데이터 추가함');
   });
  // setTimeout(1000);
   // Vintage 추가
   var Vin1 = new Vintage({
     "id_wine" : Wine1._id,
     "vintage" : 1992,
     "price_wholesale" : 10000
   });
   var Vin2 = new Vintage({
     "id_wine" : Wine1._id,
     "vintage" : 2992,
     "price_wholesale" : 10000
   });
   var Vin3 = new Vintage({
     "id_wine" : Wine3._id,
     "vintage" : 3992,
     "price_wholesale" : 10000
   });
   var Vin4 = new Vintage({
     "id_wine" : Wine3._id,
     "vintage" : 4992,
     "price_wholesale" : 10000
   });
   var Vin5 = new Vintage({
     "id_wine" : Wine5._id,
     "vintage" : 5992,
     "price_wholesale" : 10000
   });

   Vin1.save(function(err){
     if(err){
       return;
     }
     console.log('Vin1 데이터 추가함');
   });
   Vin2.save(function(err){
     if(err){
       return;
     }
     console.log('Vin2 데이터 추가함');
   });
   Vin3.save(function(err){
     if(err){
       return;
     }
     console.log('Vin3 데이터 추가함');
   });
   Vin4.save(function(err){
     if(err){
       return;
     }
     console.log('Vin4 데이터 추가함');
   });
   Vin5.save(function(err){
     if(err){
       return;
     }
     console.log('Vin5 데이터 추가함');
   });
  // setTimeout(1000);

   // Store 추가
   var Store1 = new Store({
     "id_vintage" : Vin1._id,
     "storage" : "1 Store"
   })
   var Store2 = new Store({
     "id_vintage" : Vin2._id,
     "storage" : "2 Store"
   })
   var Store3 = new Store({
     "id_vintage" : Vin3._id,
     "storage" : "3 Store"
   })
   var Store4 = new Store({
     "id_vintage" : Vin4._id,
     "storage" : "4 Store"
   })
   var Store5 = new Store({
     "id_vintage" : Vin5._id,
     "storage" : "5 Store"
   })
   Store1.save(function(err){
     if(err){
       return;
     }
     console.log('Store 1 데이터 추가함');
   });
   Store2.save(function(err){
     if(err){
       return;
     }
     console.log('Store 2 데이터 추가함');
   });
   Store3.save(function(err){
     if(err){
       return;
     }
     console.log('Store 3 데이터 추가함');
   });
   Store4.save(function(err){
     if(err){
       return;
     }
     console.log('Store 4 데이터 추가함');
   });
   Store5.save(function(err){
     if(err){
       return;
     }
     console.log('Store 5 데이터 추가함');
   });
   //setTimeout(1000);

});
