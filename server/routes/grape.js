import express from 'express';
import { Grape } from '../models';

const router = express.Router();

router.get('/', (req, res) => {
  Grape
    .find({})
    .lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: '품종 조회 오류 : 오류가 있습니다.' });
      }
      return res.json({
        data: results,
      });
    });
});
// Grape을 만든다.
router.post('/', (req, res) => {
  const grape = new Grape({
    name: req.body.data.name,
  });
  grape.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 생성 오류 : 중복된 품종이 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// Grape 삭제한다.
router.delete('/', (req, res) => {
  Grape.findOneAndRemove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 삭제 오류 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// Grape 삭제한다.
router.delete('/all', (req, res) => {
  Grape.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '품종 삭제 오류 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
export default router;
