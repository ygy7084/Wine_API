import express from 'express';
import {Store} from '../models';

const router = express.Router();

// Store 추가.
router.post('/', (req, res) => {
  const store = new Store(req.body.data);
  store.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Store Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

// 입출고내역 조회 (매장별)
router.get('/list/:id_shop', (req, res) => {
  Store.find({id_shop:req.params.id_shop}).lean().exec((err, results) => {
    if(err){
      console.error(err);
      return res.status(500).json({message : 'Store(by shop) find error'+ err.message});
    }
    else{
      if(result){res.json(result)};
    }
  });
});

// 입출고내역 전체 조회.
router.get('/list', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Store.find().lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Store(all) find Error - '+err.message});
    }
    else {
      return res.json({
        data : results,
      });
    }
  });
});

// 입출고내역 수정
router.put('/', (req, res) => {
  Store.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Store Modify Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//Stoer 삭제
router.delete('/', (req, res) => {
  Store.remove({_id:req.body.data._id}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Store Delete Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

export default router;
