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
  CustomerBase.findOne({ phone: req.body.data.phone }).lean().exec((err, result) => {
    if (result) {
      const customer = new Customer({
        name: req.body.data.name,
        phone: req.body.data.phone,
        shop: req.body.data.shop,
        email: req.body.data.email,
        address: req.body.data.address,
        customerBase: result._id,
      });
      customer.save((err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 고객이 있습니다.' });
        }
        return res.json({
          data: results,
        });
      });
    } else {
      let customerBase;
      customerBase = new CustomerBase({
        name: req.body.data.name,
        phone: req.body.data.phone,
        email: req.body.data.email,
        address: req.body.data.address,
      });
      customerBase.save((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
        }
        const customer = new Customer({
          name: req.body.data.name,
          phone: req.body.data.phone,
          shop: req.body.data.shop,
          email: req.body.data.email,
          address: req.body.data.address,
          customerBase: result._id,
        });
        customer.save((err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
          }
          return res.json({
            data: result,
          });
        });
      });
    }
  });
});
router.get('/all/:id', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Customer.find({
    shop: req.params.id,
  }).populate('shop').exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(individual) find Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});
router.get('/all', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Customer.find({}).populate('shop').sort({ name: 1 }).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(individual) find Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});
// Customer을 수정한다.
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 수정 오류: _id가 전송되지 않았습니다.' });
  }
  if (
    !isObjectHasValidString(req.body.data, 'name') ||
    !isObjectHasValidString(req.body.data, 'phone')
  ) {
    return res.status(500).json({ message: '고객 수정 오류: 전화번호와 이름은 필수입니다.' });
  }
  const properties = [
    'name',
    'phone',
    'email',
    'address',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Customer.findOneAndUpdate({ _id: req.body.data._id }, update, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Customer Modify Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
router.delete('/all/:id', (req, res) => {
  const CustomerBulk = [];
  const StoreBulk = [];
  async.waterfall([
    function(cb){
      Customer.find({
        shop: req.params.id,
      }, (err,result) =>{
        for(const obj of result){
          CustomerBulk.push({
            deleteMany: {
              filter: { _id: obj._id }
            }
          })
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        customer: { $in: CustomerBulk.map(obj => obj.deleteMany.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteMany: {
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
  ], () => {
    return res.json({
      data: true,
    });
  })
});
router.delete('/all', (req, res) => {
  const CustomerBulk = [];
  const StoreBulk = [];
  async.waterfall([
    function(cb){
      Customer.find({}, (err,result) =>{
        for(const obj of result){
          CustomerBulk.push({
            deleteMany: {
              filter: { _id: obj._id }
            }
          })
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        customer: { $in: CustomerBulk.map(obj => obj.deleteMany.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteMany: {
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
  const CustomerBulk = [];
  const StoreBulk = [];
  CustomerBulk.push({
    deleteMany: {
      filter: { _id: req.body.data._id }
    }
  });
  async.waterfall([
    function(cb) {
      Store.find({
        customer: req.body.data._id,
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteMany: {
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
  ], () => {
    return res.json({
      data: true,
    });
  })
});

export default router;
