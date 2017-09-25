import express from 'express';
import { Vintage } from '../models';
import { Store } from '../models';
import { Sale } from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

// 빈티지를 만든다.
router.post('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'original') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'wholeSalePrice')
  ) {
    return res.status(500).json({ message: '빈티지 생성 오류: 올바른 값을 입력하십시요.' });
  }
  const vintage = new Vintage({
    original: req.body.data.original,
    vintage: req.body.data.vintage,
    wholeSalePrice: req.body.data.wholeSalePrice,
  });
  vintage.save((err, results) => {
    if (err) {
      return res.status(500).json({ message: '빈티지 생성 오류: 중복된 빈티지가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// num개의 vintage를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
  const num = req.params.num;
  const page = req.params.page;

  Vintage.find().populate('id_wine').skip(num * page).limit(Number(num))
    .lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `Vintage Read Error - ${err.message}` });
      }

      Vintage.count({}, (err, c) => res.json({
        data: results,
        size: c,
      }));
    });
});
// 빈티지를 조회한다(조건x 여러개).
router.get('/list', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Vintage.find().populate('id_wine').limit(20).lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `Vintage Read Error - ${err.message}` });
      }

      Vintage.count({}, (err, c) => res.json({
        data: results,
        size: c,
      }));
    });
});
// 빈티지 전체 조회
router.get('/all', (req, res) => {
  Vintage.find({}).populate('original').lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '빈티지 조회 오류: 에러가 있습니다.' });
    }

    return res.json({
      data: results,
    });
  });
});

// 빈티지 개별 조회
router.get('/list/:_id', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Vintage.findOne({ _id: req.params._id }).populate('id_wine').lean().exec((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Vintage Read Error - ${err.message}` });
    }

    return res.json({
      data: result,
    });
  });
});

// 빈티지를 수정한다.
router.put('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, '_id') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'wholeSalePrice')
  ) {
    return res.status(500).json({ message: '빈티지 생성 오류: 올바른 값을 입력하십시요.' });
  }
  const properties = [
    'vintage',
    'wholeSalePrice',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Vintage.findOneAndUpdate({ _id: req.body.data._id }, update, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '빈티지 수정 오류: 중복된 빈티지가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

// 빈티지를 삭제한다. 연결된 Store 의 id_vintage는 null로 변경한다, 연결된 sale은 지운다.
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '빈티지 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Vintage.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '빈티지 삭제 오류: 삭제에 에러가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  // Store.updateMany({id_vintage:req.body.data._id}, {$set:{id_vintage:null}}, (err,callback)=>{
  //   Sale.remove({id_vintage:req.body.data._id}, (err,result)=>{
  //     if(err){
  //       console.error(err);
  //       return res.status(500).json({message: 'Related Sale remove error while removing Vintage - '+err.message})
  //     }
  //     else{
  //       Vintage.remove({_id:req.body.data._id}, (err, results) => {
  //         if(err) {
  //           console.error(err);
  //           return res.status(500).json({message:'Vintage Delete Error - '+err.message});
  //         }
  //         else {
  //           console.log('vintage removed'+results);
  //         }
  //       });
  //     }
  //   })
  // });
  // return res.json({
  //   success : true
  // })
});

router.delete('/all', (req, res) => {
  Vintage.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: '빈티지 삭제 오류: DB 작업에 에러가 있습니다.' });
    }
    return res.json({
      data: result,
    });
  });
});

export default router;
