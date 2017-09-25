import express from 'express';
import { Customer } from '../models';
import { Store } from '../models';
import {
  isObjectHasValidString,
} from './modules';
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
  const customer = new Customer({
    name: req.body.data.name,
    phone: req.body.data.phone,
    email: req.body.data.email,
    grade: req.body.data.grade,
    address: req.body.data.address,
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
});

// customer 조회 (매장별) ***** customer을 Store에서 populate 하였으므로 store 정보 안에
// 찾고자하는 customer 정보가 들어있음
router.get('/list/:id_shop', (req, res) => {
  Store.find({ id_shop: req.params.id_shop }).populate('id_customer').lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(by shop) find error${err.message}` });
    }

    const arr = [];
    for (const obj of results) {
      arr.push(obj.id_customer);
    }
    return res.json(arr);
  });
});

// customer 전체 조회.
router.get('/list', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Customer.find().lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `customer(all) find Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});

// customer 개별 조회(_id)
router.get('/list/:_id', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Customer.find({ _id: req.params._id }).lean().exec((err, results) => {
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
  Customer.find({}).lean().exec((err, results) => {
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
    'grade',
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
