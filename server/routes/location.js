import express from 'express';
import {Location} from '../models';

const router = express.Router();

//Location을 만든다.
router.post('/', (req, res) => {
  const location = new Location(req.body.data);
  location.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Location Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//Location 삭제한다.
router.delete('/', (req, res) => {
  Location.remove({_id:req.body.data._id}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Sale Delete Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

export default router;
