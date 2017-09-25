import express from 'express';
import { Category } from '../models';

const router = express.Router();

// category를 만든다.
router.post('/', (req, res) => {
  const category = new Category(req.body.data);
  category.save((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `category Create Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

// Category 삭제한다.
router.delete('/', (req, res) => {
  Category.remove({ _id: req.body.data._id }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Category Delete Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});

export default router;
