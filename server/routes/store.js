import express from 'express';
import { Store } from '../models';
import { Datetime } from './modules';

const router = express.Router();

// Store 추가.
router.post('/', (req, res) => {
  if(
    !req.body.data.sale ||
    !req.body.data.shop ||
    !req.body.data.customer
  ) {
    return res.status(500).json({ message: '입출고 생성 에러: 입력에 오류가 있습니다.' });
  }
  const store = new Store({
    sale: req.body.data.sale,
    shop: req.body.data.shop,
    customer: req.body.data.customer,
    datetime: new Datetime(new Date()).dateObject,
    quantityChange: req.body.data.quantityChange,
    storage: req.body.data.storage,
    wineName: req.body.data.wineName,
    wineVintage: req.body.data.wineVintage,
    wineShop: req.body.data.wineShop,
  });
  store.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store Create Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

// 입출고내역 조회 (매장별)
router.get('/list/:id_shop', (req, res) => {
  Store.find({ id_shop: req.params.id_shop }).lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store(by shop) find error${err.message}` });
    }

    if (results) { res.json(results); }
  });
});

// 입출고내역 전체 조회.
router.get('/list', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Store.find().lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store(all) find Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
// 입출고내역 전체 조회.
router.get('/all', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Store.find().populate([{ path: 'sale', populate: { path: 'vintage', populate: { path: 'original' } } }, 'shop', 'customer']).exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store(all) find Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

// 입출고내역 수정
router.put('/', (req, res) => {
  Store.update({ _id: req.body.data._id }, { $set: req.body.data }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store Modify Error - ${err.message}` });
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
  Store.insertMany(arr.map(obj => { return {
      sale: obj.sale,
      shop: obj.shop,
      customer: obj.customer,
      datetime: new Datetime(new Date()).dateObject,
      quantityChange: obj.quantityChange,
      storage: obj.storage,
      wineName: obj.wineName,
      wineVintage: obj.wineVintage,
      wineShop: obj.wineShop,
  }})
    , (err, docs) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store Insert Error - ${err.message}` });
    }
    return res.json({
      data: docs,
    });
  });
});
// Stoer 삭제
router.delete('/', (req, res) => {
  Store.remove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store Delete Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
// Stoer 삭제
router.delete('/all', (req, res) => {
  Store.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Store Delete Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});

export default router;
