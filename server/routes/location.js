import express from 'express';
import { Location } from '../models';

const router = express.Router();

// Location을 만든다.
router.post('/', (req, res) => {
  const location = new Location(req.body.data);
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
router.get('/all', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Location.find().lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Location Read Error - ${err.message}` });
    }

    res.json({
      data: results,
    });
  });
});

// Location 삭제한다.
router.delete('/', (req, res) => {
  Location.remove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Sale Delete Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

export default router;
