var mongoose = require('mongoose')

// DB 객체를 위한 변수 선언
var database;

var Wine = require('../models').Wine;
var Vintage = require('../models').Vintage;
var Shop = require('../models').Shop;
var Customer = require('../models').Customer;
var Store = require('../models').Store;
var Sale = require('../models').Sale;
var Location = require('../models').Location;
var Category = require('../models').Category;
var Grape = require('../models').Grape;

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
  {
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
  }
  // shop 추가
  {
    var shop1 = new Shop({
      "name" : "shop 1",
      "id" : "shop 1",
      "password" : "shop 1",
      "phone" : "shop 1"
    })
    var shop2 = new Shop({
      "name" : "shop 2",
      "id" : "shop 2",
      "password" : "shop 2",
      "phone" : "shop 2"
    })
    var shop3 = new Shop({
      "name" : "shop 3",
      "id" : "shop 3",
      "password" : "shop 3",
      "phone" : "shop 3"
    })
    var shop4 = new Shop({
      "name" : "shop 4",
      "id" : "shop 4",
      "password" : "shop 4",
      "phone" : "shop 4"
    })
    var shop5 = new Shop({
      "name" : "shop 5",
      "id" : "shop 5",
      "password" : "shop 5",
      "phone" : "shop 5"
    })
  }
  // Vintage 추가
  {
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
  }
  //sale 추가
  {
    var sale1 = new Sale({
     "id_vintage" : Vin1._id,
     "id_shop" : shop1._id,
     "price" : 1,
     "price_lowest" : 1
    })
    var sale2 = new Sale({
      "id_vintage" : Vin2._id,
      "id_shop" : shop1._id,
      "price" : 2,
      "price_lowest" : 2
    })
    var sale3 = new Sale({
      "id_vintage" : Vin1._id,
      "id_shop" : shop2._id,
      "price" : 3,
      "price_lowest" : 3
    })
    var sale4 = new Sale({
      "id_vintage" : Vin2._id,
      "id_shop" : shop2._id,
      "price" : 4,
      "price_lowest" : 4
    })
    var sale5 = new Sale({
      "id_vintage" : Vin5._id,
      "id_shop" : shop3._id,
      "price" : 5,
      "price_lowest" : 5
    })
  }
  //customer 추가
  {
    var customer1 = new Customer({
      "name" : "Cus 1",
      "phone" : "Cus 1",
      "email" : "Cus 1",
      "grade" : 1,
      "address" : "Cus 1"
    })
    var customer2 = new Customer({
      "name" : "Cus 2",
      "phone" : "Cus 2",
      "email" : "Cus 2",
      "grade" : 2,
      "address" : "Cus 2"
    })
    var customer3 = new Customer({
      "name" : "Cus 3",
      "phone" : "Cus 3",
      "email" : "Cus 3",
      "grade" : 3,
      "address" : "Cus 3"
    })
    var customer4 = new Customer({
      "name" : "Cus 4",
      "phone" : "Cus 4",
      "email" : "Cus 4",
      "grade" : 4,
      "address" : "Cus 4"
    })
    var customer5 = new Customer({
      "name" : "Cus 5",
      "phone" : "Cus 5",
      "email" : "Cus 5",
      "grade" : 5,
      "address" : "Cus 5"
    })
  }
  //store 추가
  {
    var store1 = new Store({
      "id_vintage" : Vin1._id,
      "id_shop" : shop1._id,
      "id_customer" : customer1._id,
      "quantity_change" : 1,
      "storage" : "store 1",
      "wine_name" : "store 1",
      "wine_vintage" : 1,
      "shop_name" : "store 1"
    })
    var store2 = new Store({
      "id_vintage" : Vin1._id,
      "id_shop" : shop2._id,
      "id_customer" : customer2.id,
      "quantity_change" : 2,
      "storage" : "store 2",
      "wine_name" : "store 2",
      "wine_vintage" : 2,
      "shop_name" : "store 2"
    })
    var store3 = new Store({
      "id_vintage" : Vin2._id,
      "id_shop" : shop2._id,
      "id_customer" : customer3._id,
      "quantity_change" : 3,
      "storage" : "store 3",
      "wine_name" : "store 3",
      "wine_vintage" : 3,
      "shop_name" : "store 3"
    })
    var store4 = new Store({
      "id_vintage" : Vin3._id,
      "id_shop" : shop3._id,
      "id_customer" : customer3._id,
      "quantity_change" : 4,
      "storage" : "store 4",
      "wine_name" : "store 4",
      "wine_vintage" : 4,
      "shop_name" : "store 4"
    })
    var store5 = new Store({
      "id_vintage" : Vin4._id,
      "id_shop" : shop4._id,
      "id_customer" : customer4._id,
      "quantity_change" : 5,
      "storage" : "store 5",
      "wine_name" : "store 5",
      "wine_vintage" : 5,
      "shop_name" : "store 5"
    })
  }
  //location 추가
  {
    var location1 = new Location({
      "country" : "loc 1",
      "region" : "loc 1",
      "subregion" : "loc 1"
    })
    var location2 = new Location({
      "country" : "loc 2",
      "region" : "loc 2",
      "subregion" : "loc 2"
    })
    var location3 = new Location({
      "country" : "loc 3",
      "region" : "loc 3",
      "subregion" : "loc 3"
    })
    var location4 = new Location({
      "country" : "loc 4",
      "region" : "loc 4",
      "subregion" : "loc 4"
    })
    var location5 = new Location({
      "country" : "loc 5",
      "region" : "loc 5",
      "subregion" : "loc 5"
    })
  }
  //category 추가
  {
    var category1 = new Category({
      "name" : "cate 1"
    })
    var category2 = new Category({
      "name" : "cate 2"
    })
    var category3 = new Category({
      "name" : "cate 3"
    })
    var category4 = new Category({
      "name" : "cate 4"
    })
    var category5 = new Category({
      "name" : "cate 5"
    })
  }
  //grape 추가
  {
    var grape1 = new Grape({
      "name" : "grape 1"
    })
    var grape2 = new Grape({
      "name" : "grape 2"
    })
    var grape3 = new Grape({
      "name" : "grape 3"
    })
    var grape4 = new Grape({
      "name" : "grape 4"
    })
    var grape5 = new Grape({
      "name" : "grape 5"
    })
  }




   for(var i =0; i<9; i++){
     //shop
     if(i==0){
       shop1.save(function(err){
        if(err){
          return;
        }
        console.log('shop 1 데이터 추가함');
      });
      shop2.save(function(err){
        if(err){
          return;
        }
        console.log('shop 2 데이터 추가함');
      });
      shop3.save(function(err){
        if(err){
          return;
        }
        console.log('shop 3 데이터 추가함');
      });
      shop4.save(function(err){
        if(err){
          return;
        }
        console.log('shop 4 데이터 추가함');
      });
      shop5.save(function(err){
        if(err){
          return;
        }
        console.log('shop 5 데이터 추가함');
      });
    }
    //wine
    else if(i==1){
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
    }
    //vin
    else if(i==2){
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
    }
    //store
    else if(i==8){
      store1.save(function(err){
        if(err){
          console.log(err);
          return;
        }
        console.log('Store 1 데이터 추가함');
      });
      store2.save(function(err){
        if(err){
          return;
        }
        console.log('Store 2 데이터 추가함');
      });
      store3.save(function(err){
        if(err){
          return;
        }
        console.log('Store 3 데이터 추가함');
      });
      store4.save(function(err){
        if(err){
          return;
        }
        console.log('Store 4 데이터 추가함');
      });
      store5.save(function(err){
        if(err){
          return;
        }
        console.log('Store 5 데이터 추가함');
      });
    }
    //sale
    else if(i==7){
      sale1.save(function(err){
        if(err){
          return;
        }
        console.log('sale 1 데이터 추가함');
      });
      sale2.save(function(err){
        if(err){
          return;
        }
        console.log('sale 2 데이터 추가함');
      });
      sale3.save(function(err){
        if(err){
          return;
        }
        console.log('sale 3 데이터 추가함');
      });
      sale4.save(function(err){
        if(err){
          return;
        }
        console.log('sale 4 데이터 추가함');
      });
      sale5.save(function(err){
        if(err){
          return;
        }
        console.log('sale 5 데이터 추가함');
      });
    }
    //customer
    else if(i==3){
      customer1.save(function(err){
        if(err){
          console.log(err);
          return;
        }
        console.log('customer 1 데이터 추가함');
      });
      customer2.save(function(err){
        if(err){
          return;
        }
        console.log('customer 2 데이터 추가함');
      });
      customer3.save(function(err){
        if(err){
          return;
        }
        console.log('customer 3 데이터 추가함');
      });
      customer4.save(function(err){
        if(err){
          return;
        }
        console.log('customer 4 데이터 추가함');
      });
      customer5.save(function(err){
        if(err){
          return;
        }
        console.log('customer 5 데이터 추가함');
      });
    }
    //location
    else if(i==4){
      location1.save(function(err){
        if(err){
          return;
        }
        console.log('location 1 데이터 추가함');
      });
      location2.save(function(err){
        if(err){
          return;
        }
        console.log('location 2 데이터 추가함');
      });
      location3.save(function(err){
        if(err){
          return;
        }
        console.log('location 3 데이터 추가함');
      });
      location4.save(function(err){
        if(err){
          return;
        }
        console.log('location 4 데이터 추가함');
      });
      location5.save(function(err){
        if(err){
          return;
        }
        console.log('location 5 데이터 추가함');
      });
    }
    //category
    else if(i==5){
      category1.save(function(err){
        if(err){
          return;
        }
        console.log('category 1 데이터 추가함');
      });
      category2.save(function(err){
        if(err){
          return;
        }
        console.log('category 2 데이터 추가함');
      });
      category3.save(function(err){
        if(err){
          return;
        }
        console.log('category 3 데이터 추가함');
      });
      category4.save(function(err){
        if(err){
          return;
        }
        console.log('category 4 데이터 추가함');
      });
      category5.save(function(err){
        if(err){
          return;
        }
        console.log('category 5 데이터 추가함');
      });
    }
    //grape
    else if(i==6){
      grape1.save(function(err){
        if(err){
          return;
        }
        console.log('grape 1 데이터 추가함');
      });
      grape2.save(function(err){
        if(err){
          return;
        }
        console.log('grape 2 데이터 추가함');
      });
      grape3.save(function(err){
        if(err){
          return;
        }
        console.log('grape 3 데이터 추가함');
      });
      grape4.save(function(err){
        if(err){
          return;
        }
        console.log('grape 4 데이터 추가함');
      });
      grape5.save(function(err){
        if(err){
          return;
        }
        console.log('grape 5 데이터 추가함');
      });
    }
  }  // for 문의 끝
});
