import express from 'express';
import { Sale } from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

// sale을 만든다.
router.post('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'shop')
  ) {
    return res.status(500).json({ message: '상품 생성 오류: 올바른 값을 입력하십시요.' });
  }
  const sale = new Sale({
    vintage: req.body.data.vintage,
    shop: req.body.data.shop,
    price: req.body.data.price,
    lowestPrice: req.body.data.lowestPrice,
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
router.get('/all', (req, res) => {
  Sale.find({}).populate([{ path: 'vintage', populate: { path: 'original' } }, 'shop']).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 조회 오류: 에러가 있습니다.' });
    }
    for (const obj of results) {
      if (obj.vintage && obj.vintage.original) {
        obj.vintage['eng_fullname'] = obj.vintage.original.eng_fullname;
        obj.vintage['eng_shortname'] = obj.vintage.original.eng_shortname;
        obj.vintage['kor_fullname'] = obj.vintage.original.kor_fullname;
        obj.vintage['kor_shortname'] = obj.vintage.original.kor_shortname;
        obj.vintage['category'] = obj.vintage.original.category;
        obj.vintage['country'] = obj.vintage.original.country;
        obj.vintage['region'] = obj.vintage.original.region;
        obj.vintage['subregion'] = obj.vintage.original.subregion;
        obj.vintage['desc'] = obj.vintage.original.desc;
        obj.vintage['photo_url'] = obj.vintage.original.photo_url;
        obj.vintage['grape_race'] = obj.vintage.original.grape_race;
        obj.vintage['locationString'] = obj.vintage.original.locationString;
        obj.vintage['grapeString'] = obj.vintage.original.grapeString;
      }
    }
    return res.json({
      data: results,
    });
  });
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
    return res.status(500).json({ message: '상품 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Sale.findOneAndRemove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 삭제 오류: 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// sale 삭제한다.
router.delete('/all', (req, res) => {
  Sale.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '상품 삭제 오류: 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

export default router;
