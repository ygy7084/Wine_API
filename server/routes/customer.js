import express from 'express';
import {Customer} from '../models';
import {Store} from '../models';

const router = express.Router();

// Customer를 만든다.
router.post('/', (req, res) => {
  const customer = new Customer(req.body.data);
  customer.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'customer Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

// customer 조회 (매장별)
router.get('/list/:id_shop', (req, res) => {
  Store.find({id_shop:req.params.id_shop}).lean().exec((err, results) => {
    for(var i=0; i<results.length;i++){
      Customer.find({_id:results[i].id_customer}, (err, result) => {
        if(err){
          console.error(err);
          return res.status(500).json({message : 'customer(by shop) find error'+ err.message});
        }
        else{
          if(result){res.json(result)};
        }
      });
    }
  });
});

// customer 전체 조회.
router.get('/list', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Customer.find().lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'customer(all) find Error - '+err.message});
    }
    else {
      return res.json({
        data : results,
      });
    }
  });
});

//customer 개별 조회(_id)
router.get('/list/:_id', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Customer.find({_id:req.params._id}).lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'customer(individual) find Error - '+err.message});
    }
    else {
      return res.json({
        data : results,
      });
    }
  });
});

// Customer을 수정한다.
router.put('/', (req, res) => {
  Customer.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Customer Modify Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//Customer 삭제
router.delete('/', (req, res) => {
  Store.remove({id_customer:req.body.data._id}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Customer Delete Error - '+err.message});
    }
    else {
      Customer.remove({_id:req.body.data._id},(err, results) =>{
        return res.json({
            data : results
        });
      })
    }
  });
});

export default router;
