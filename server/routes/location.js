import express from 'express';
import { Location } from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

router.get('/', (req, res) => {
  Location
    .find({})
    .lean()
    .exec((err, results) => {
      if (err) {
        return res.status(500).json({ message: '장소 조회 에러 : 에러가 있습니다.' });
      }
      return res.json({
        data: results,
      });
    });
});
// Location을 만든다.
router.post('/', (req, res) => {
  if (!isObjectHasValidString(req.body.data, 'country')) {
    if ((!isObjectHasValidString(req.body.data, 'region') && isObjectHasValidString(req.body.data, 'subregion')) ||
        isObjectHasValidString(req.body.data, 'region')) {
      return res.status(500).json({ message: '원산지 생성 에러 : 빈칸이 있습니다.' });
    }
  } else if (
    isObjectHasValidString(req.body.data, 'country') &&
    !isObjectHasValidString(req.body.data, 'region') &&
    isObjectHasValidString(req.body.data, 'subregion')
  ) {
    return res.status(500).json({ message: '원산지 생성 에러 : 빈칸이 있습니다.' });
  }
  const location = new Location({
    country: req.body.data.country,
    region: req.body.data.region,
    subregion: req.body.data.subregion,
  });
  location.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '장소 생성 에러 : 같은 데이터가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// Location 삭제한다.
router.delete('/', (req, res) => {
  Location.findOneAndRemove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '장소 삭제 에러 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});
// Location 삭제한다.
router.delete('/all', (req, res) => {
  Location.deleteMany({}, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '장소 삭제 에러 : 삭제에 에러가 있습니다.' });
    }
    return res.json({
      data: results,
    });
  });
});

export default router;
