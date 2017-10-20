import express from 'express';
import {
  Configuration,
  CustomerBase,
} from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

// 설정 반환
router.get('/', (req, res) => {
  Configuration.findOne({})
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '설정 조회 오류: 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 설정 수정
router.put('/', (req, res) => {
  const properties = [
    'email',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Configuration.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '설정 수정 오류: 에러가 발생했습니다.' });
      }
      console.log(result);
      return res.json({
        data: result,
      });
    },
  );
  return null;
});

export default router;
