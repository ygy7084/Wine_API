import express from 'express';
import async from 'async';
import {
  Customer,
  Store,
  CustomerBase,
} from '../models';
import {
  isObjectHasValidString,
}
  from './modules';

const router = express.Router();

router.post('/', (req, res) => {
  if (
    !isObjectHasValidString(req.body.data, 'name') ||
    !isObjectHasValidString(req.body.data, 'phone')
  ) {
    return res.status(500).json({ message: '고객 생성 오류: 이름과 전화번호는 필수입니다.' });
  }
  let customerBase;
  customerBase = new CustomerBase({
    name: req.body.data.name,
    phone: req.body.data.phone,
    email: req.body.data.email,
    level: req.body.data.level,
    address: req.body.data.address,
  });
  customerBase.save((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
    }
      return res.json({
        data: result,
      });
  });
});

router.get('/', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  CustomerBase.find({}).sort({ name: 1 }).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(individual) find Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});
router.get('/phone/:number', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  CustomerBase.find({}).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(individual) find Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});
router.get('/history/:id', (req, res) => {
  Customer.find({ customerBase: req.params.id })
    .lean()
    .exec((err, result) => {
      if (err || !result) {
        res.status(500).json({ message: '에러가 있습니다.' });
      }
      Store.find({
        customer: { $in: result.map(obj => obj._id)}
      })
        .sort({ _id: -1 })
        .populate([{ path: 'sale', populate: { path: 'vintage', populate: { path: 'original' } } }, 'shop', 'customer'])
        .exec((err, results) => {
          if (err) {
            res.status(500).json({message: '에러가 있습니다.'});
          }
          res.json({ data: results });
        });
    })
});
router.get('/stored/:id', (req, res) => {
  Customer.find({ customerBase: req.params.id })
    .lean()
    .exec((err, result) => {
      if (err || !result) {
        res.status(500).json({ message: '에러가 있습니다.' });
      }
      Store.aggregate([
        {
          $match: {
            customer: { $in: result.map(obj => obj._id)}
          }
        },
        {
          $group: {
            _id: {
              sale: "$sale",
              shop: "$shop",
            },
            total: { $sum: "$quantityChange"}
          }
        },
        {
          $lookup: {
            from: "sales",
            localField: "_id.sale",
            foreignField: "_id",
            as: "sale",
          }
        },
        {
          $unwind: "$sale"
        },
        {
          $lookup: {
            from: "vintages",
            localField: "sale.vintage",
            foreignField: "_id",
            as: "vintage",
          }
        },
        {
          $unwind: "$vintage"
        },
        {
          $lookup: {
            from: "originals",
            localField: "vintage.original",
            foreignField: "_id",
            as: "original",
          }
        },
        {
          $unwind: "$original"
        },
        {
          $lookup: {
            from: "shops",
            localField: "_id.shop",
            foreignField: "_id",
            as: "shop",
          }
        },
        {
          $unwind: "$shop"
        }
      ]).exec((error, result) => {
        return res.json({ data: result.filter(obj => obj.total !== 0) });
      })
    })
});
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 수정 오류: _id가 전송되지 않았습니다.' });
  }
  const properties = [
    'name',
    'phone',
    'email',
    'password',
    'address',
    'level',
    'accounts'
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  CustomerBase.findOneAndUpdate({ _id: req.body.data._id }, update, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Customer Modify Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
router.delete('/all', (req, res) => {
  const CustomerBaseBulk = [];
  const CustomerBulk = [];
  const StoreBulk = [];
  async.waterfall([
    function(cb){
      CustomerBase.find(
        {},
        (err,result) =>{
        for(const obj of result){
          CustomerBaseBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          })
        }
        cb(null);
      });
    },
    function(cb){
      Customer.find({
        customerBase: { $in: CustomerBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err,result) =>{
        for(const obj of result){
          CustomerBulk.push({
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
        customer: { $in: CustomerBulk.map(obj => obj.deleteOne.filter._id)}
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
      Store.bulkWrite(StoreBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    },
    function(cb) {
      Customer.bulkWrite(CustomerBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    },
    function(cb) {
      CustomerBase.bulkWrite(CustomerBaseBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    },
  ], () => {
    return res.json({
      data: true,
    });
  })
});
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: 'Customer 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  const CustomerBaseBulk = [];
  const CustomerBulk = [];
  const StoreBulk = [];

  CustomerBaseBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  async.waterfall([
    function(cb) {
      Customer.find({
        customerBase: req.body.data._id,
      }, (err, result) => {
        for (const obj of result) {
          CustomerBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        customer: req.body.data._id,
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
      Store.bulkWrite(StoreBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    },
    function(cb) {
      Customer.bulkWrite(CustomerBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    },
    function(cb) {
      CustomerBase.bulkWrite(CustomerBaseBulk)
        .then((r1) => {
          cb(null);
        })
        .catch((e) => {
          cb(null);
        })
    }
  ], () => {
    return res.json({
      data: true,
    });
  })
});

export default router;
