import express from 'express';
import {Grape} from '../models';

const router = express.Router();

//Grape을 만든다.
router.post('/', (req, res) => {
  const grape = new Grape(req.body.data);
  grape.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'grape Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//Grape 삭제한다.
router.delete('/', (req, res) => {
  Grape.remove({_id:req.body.data._id}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Grape Delete Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

export default router;
