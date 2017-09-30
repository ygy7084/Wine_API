import express from 'express';
import {
  Account,
  Shop,
  Sale,
  Store,
} from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

// shop 추가.
router.post('/', (req, res) => {
  if (!isObjectHasValidString(req.body.data, 'name')) {
    return res.status(500).json({ message: '매장 생성 에러: 올바른 값을 입력하십시요.' });
  }
  const shop = new Shop({
    name: req.body.data.name,
    phone: req.body.data.phone,
    memo: req.body.data.memo,
  });
  shop.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '매장 생성 에러: 중복된 이름이 존재하거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// shop 전체 조회 --> 매장리스트와, 전체 매장 수 반환
router.get('/all/:id', (req, res) => {
  Shop.find({
    _id: req.params.id,
  }).lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `shop Read Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});

// shop 전체 조회 --> 매장리스트와, 전체 매장 수 반환
router.get('/all', (req, res) => {
  Shop.find().lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `shop Read Error - ${err.message}` });
    }
    return res.json({
      data: results,
    });
  });
});

// 매장 입고 와인 조회  --> Store에서 해당 매장 자료들을 추출해 populate 함
router.get('/list/wine/:id_shop', (req, res) => {
  Store.find({ id_shop: req.params.id_shop })
    .populate([{ path: 'id_vintage', populate: { path: 'id_wine' } }, 'id_shop', 'id_customer'])
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `Shop Read Error - ${err.message}` });
      }

      return res.json({
        data: results,
      });
    });
});

// shop 개별 조회(_id)
router.get('/list/:_id', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Shop.find({ _id: req.params._id }).lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `shop Read Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

// shop 수정
router.put('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'name')
  ) {
    return res.status(500).json({ message: '매장 수정 오류: 올바른 값을 입력하십시요.' });
  }
  const properties = [
    'name',
    'phone',
    'memo',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Shop.findOneAndUpdate({ _id: req.body.data._id }, update, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '매장 수정 오류: 중복된 이름이 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// shop 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '매장 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Shop.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '매장 삭제 오류: 삭제에 에러가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  // Sale.remove({ id_shop: req.body.data._id }, (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: `related Sale Delete Error while deleting Shop- ${err.message}` });
  //   }
  //
  //   Store.updateMany({ id_shop: req.body.data._id }, { $set: { id_shop: null } }, (err, updateresult) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).json({ message: `related Store modify error${err.message}` });
  //     }
  //
  //     Shop.remove({ _id: req.body.data._id }, (err, callback) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).json({ message: `shop Delete Error - ${err.message}` });
  //       }
  //
  //       return res.json(callback);
  //     });
  //   });
  // });
});

router.delete('/all', (req, res) => {
  Shop.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '매장 삭제 오류: 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});


export default router;
