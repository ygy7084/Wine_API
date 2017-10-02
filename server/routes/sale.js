import express from 'express';
import async from 'async';
import { Sale, Store, } from '../models';
import {
  isObjectHasValidString,
  isObjectHasValidProp,
} from './modules';

const router = express.Router();

// sale을 만든다.
router.post('/', (req, res) => {
  if (
    !isObjectHasValidProp(req.body.data, 'vintage') ||
    !isObjectHasValidProp(req.body.data, 'shop') ||
    !isObjectHasValidProp(req.body.data, 'wholeSalePrice')
  ) {
    return res.status(500).json({ message: '상품 생성 오류: 올바른 값을 입력하십시요.' });
  }
  const sale = new Sale({
    vintage: req.body.data.vintage,
    shop: req.body.data.shop,
    price: req.body.data.price,
    lowestPrice: req.body.data.lowestPrice,
    wholeSalePrice: req.body.data.wholeSalePrice,
  });
  sale.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 생성 오류: 중복된 상품가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// 입출고내역 대량 입력
router.post('/bulk', (req, res) => {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '입출고 입력 오류: 값이 존재하지 않습니다.' });
  }
  const arr = req.body.data;
  Sale.insertMany(arr.map(obj => { return {
      vintage: obj.vintage,
      shop: obj.shop,
      price: obj.price ? obj.price : 0,
      lowestPrice: obj.lowestPrice ? obj.lowestPrice : 0,
      wholeSalePrice: obj.wholeSalePrice ? obj.wholeSalePrice : 0,
    }})
    , (err, docs) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `sale Insert Error - ${err.message}` });
      }
      return res.json({
        data: docs,
      });
    });
});
// num개의 sale를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
  const num = req.params.num;
  const page = req.params.page;

  Sale.find().populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop']).skip(num * page).limit(Number(num))
    .lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `Sale Read Error - ${err.message}` });
      }

      Sale.count({}, (err, c) => res.json({
        data: results,
        size: c,
      }));
    });
});
// sale을 조회한다(조건x 20개).
router.get('/list', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Sale.find().populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop']).limit(20).lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `sale Read Error - ${err.message}` });
      }

      Sale.count({}, (err, c) => res.json({
        data: results,
        size: c,
      }));
    });
});

// sale 전체 조회
router.get('/all/:id', (req, res) => {
  Sale.find({
    shop: req.params.id,
  }).populate([{ path: 'vintage', populate: { path: 'original' } }, 'shop']).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 조회 오류: 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// sale 전체 조회
router.get('/all', (req, res) => {
  Sale.find({}).populate([{ path: 'vintage', populate: { path: 'original' } }, 'shop']).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 조회 오류: 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// sale을 수정한다.
router.put('/bulk', (req, res) => {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '상품 수정 오류: 값이 존재하지 않습니다.' });
  }
  const bulkUpdateArr = [];
  for (const obj of req.body.data) {
    bulkUpdateArr.push({
      updateOne: {
        filter: { _id: obj._id },
        update: {
          price: obj.price,
          lowestPrice: obj.lowestPrice,
          wholeSalePrice: obj.wholeSalePrice,
        },
      },
    });
  }
  Sale.bulkWrite(bulkUpdateArr).then(result => res.json({ data: result }));
});
// sale을 수정한다.
router.put('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'shop')
  ) {
    return res.status(500).json({ message: '상품 생성 오류: 올바른 값을 입력하십시요.' });
  }
  const properties = [
    'vintage',
    'shop',
    'price',
    'lowestPrice',
    'wholeSalePrice',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Sale.findOneAndUpdate({ _id: req.body.data._id }, update, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 수정 오류: 중복된 상품이 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// sale 삭제한다.
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: 'Sale 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  const SaleBulk = [];
  const StoreBulk = [];
  SaleBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  async.waterfall([
    function(cb) {
      Store.find({
        sale: req.body.data._id,
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r1) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r2) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    }
  ], () => {
    return res.json({
      data: true,
    });
  })
});

//
router.delete('/bulk', (req, res) => {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '상품 삭제 오류: 값이 존재하지 않습니다.' });
  }
  const SaleBulk = [];
  const StoreBulk = [];
  for (const obj of req.body.data) {
    SaleBulk.push({
      deleteOne: {
        filter: { _id: obj._id },
      },
    });
  }
  async.waterfall([
    function(cb) {
      Store.find({
        sale: { $in: SaleBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r1) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r2) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
  ], () => {
    return res.json({
      data: true,
    });
  });
});
router.delete('/all/:id', (req, res) => {
  const SaleBulk = [];
  const StoreBulk = [];
  async.waterfall([
    function(cb){
      Sale.find({
        shop: req.params.id,
      }, (err,result) =>{
        for(const obj of result){
          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          })
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        sale: { $in: SaleBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r1) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r2) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
  ], () => {
    return res.json({
      data: true,
    });
  })
});
// sale 삭제한다.
router.delete('/all', (req, res) => {
  const SaleBulk = [];
  const StoreBulk = [];
  async.waterfall([
    function(cb){
    Sale.find({}, (err,result) =>{
          for(const obj of result){
            SaleBulk.push({
              deleteOne: {
                filter: { _id: obj._id }
              }
            })
          }
          cb(null);
      });
    },
    function(cb) {
      Store.find({
        sale: { $in: SaleBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r1) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r2) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
  ], () => {
    return res.json({
      data: true,
    });
  })
});

export default router;
