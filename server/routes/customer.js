import express from 'express';
import { Customer } from '../models';
import {
  isObjectHasValidString,
}
  from './modules';

const router = express.Router();

// const Customer = new Schema({
//   name: String,
//   phone: String,
//   email: String,
//   grade: Number,
//   address: String,
// });
// Customer를 만든다.
router.post('/', (req, res) => {
  if (
    !isObjectHasValidString(req.body.data, 'name') ||
    !isObjectHasValidString(req.body.data, 'phone')
  ) {
    return res.status(500).json({ message: '고객 생성 오류: 이름과 전화번호는 필수입니다.' });
  }
  Customer.findOne({ phone: req.body.data.phone }).lean().exec((err, result) => {
    if (result) {
      const customer = new Customer({
        name: req.body.data.name,
        phone: req.body.data.phone,
        shop: req.body.data.shop,
        email: req.body.data.email,
        address: req.body.data.address,
        webAddress: result.webAddress,
      });
      customer.save((err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
        }

        return res.json({
          data: results,
        });
      });
    } else {
      const customer = new Customer({
        name: req.body.data.name,
        phone: req.body.data.phone,
        shop: req.body.data.shop,
        email: req.body.data.email,
        address: req.body.data.address,
      });
      customer.save((err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '고객 생성 오류: 중복된 번호가 있습니다.' });
        }
        Customer.findOneAndUpdate(
          { _id: result._id },
          {
            $set: { webAddress: String(result._id) },
          },
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: '고객 생성 오류: 생성 과정에 오류가 있습니다.' });
            }
            return res.json({
              data: result,
            });
          },
        );
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
  Customer.find({}).populate('shop').exec((err, results) => {
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
  Customer.deleteMany({
    shop: req.params.id,
  }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '고객 삭제 오류: 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
router.delete('/all', (req, res) => {
  Customer.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cus' });
    }
    return res.json({
      data: results,
    });
  });
});
router.delete('/', (req, res) => {
  Customer.findOneAndRemove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cus' });
    }
    return res.json({
      data: results,
    });
  });
});
// Customer 삭제
// router.delete('/', (req, res) => {
//   Store.remove({ id_customer: req.body.data._id }, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: `Customer Delete Error - ${err.message}` });
//     }
//
//     Customer.remove({ _id: req.body.data._id }, (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Cus' });
//       }
//       return res.json({
//         data: results,
//       });
//     });
//   });
// });

export default router;
