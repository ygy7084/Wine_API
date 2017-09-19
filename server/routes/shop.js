import express from 'express';
import {Shop} from '../models';
import {Sale} from '../models';
import {Store} from '../models';

const router = express.Router();

// shop 추가.
router.post('/', (req, res) => {
  const shop = new Shop(req.body.data);
  shop.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'shop Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

// shop 전체 조회 --> 매장리스트와, 전체 매장 수 반환
router.get('/all', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Shop.find().lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'shop Read Error - '+err.message});
    }
    else {
      Shop.count({}, function(err, c){
        return res.json({
          data : results,
          size : c
        });
      })
    }
  });
});

// 매장 입고 와인 조회  --> Store에서 해당 매장 자료들을 추출해 populate 함
router.get('/list/wine/:id_shop', (req,res) =>{
  Store.find({id_shop:req.params.id_shop})
  .populate([{path: 'id_vintage', populate:{path : 'id_wine'}},'id_shop','id_customer'])
  .exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Shop Read Error - '+err.message});
    }
    else {
      return res.json({
        data : results,
      });
    }
  })
})

//shop 개별 조회(_id)
router.get('/list/:_id', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Shop.find({_id:req.params._id}).lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'shop Read Error - '+err.message});
    }
    else {
      return res.json({
        data : results,
      })
    }
  });
});

// shop 수정
router.put('/', (req, res) => {
  Shop.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Shop Modify Error - '+err.message})
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

// shop 삭제
router.delete('/', (req, res) => {
  Sale.remove({id_shop:req.body.data._id}, (err, result) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'related Sale Delete Error while deleting Shop- '+err.message});
    }
    else {
      Store.updateMany({id_shop:req.body.data._id},{$set:{id_shop:null}}, (err, updateresult) => {
        if(err){
          console.error(err);
          return res.status(500).json({message : 'related Store modify error' + err.message})
        }
        else{
          Shop.remove({_id:req.body.data._id}, (err,callback) => {
            if(err){
              console.error(err);
              return res.status(500).json({message:'shop Delete Error - '+err.message});
            }
            else {
              return res.json(callback);
            }
          })
        }
      });
    }
  });
});



export default router;
