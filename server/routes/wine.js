import express from 'express';
import {Wine} from '../models';
import {Vintage} from '../models';
import {Store} from '../models';

const router = express.Router();

// wine을 추가한다.
router.post('/', (req, res) => {
  const wine = new Wine(req.body.data);
  wine.save((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'wine Create Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//num개의 와인을 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
  const num = req.params.num;
  const page = req.params.page;
  Wine.find().skip(Number(num*page)).limit(Number(num)).lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Wine Read Error - '+err.message});
    }
    else {
      Wine.count({}, function(err, c){
        return res.json({
          data : results,
          size : c
        });
      });
    }
  });
});

//와인을 조회한다.
router.get('/list', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Wine.find().limit(20).lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Wine Read Error - '+err.message});
    }
    else {
      Wine.count({}, function(err, c){
        return res.json({
          data : results,
          size : c
        });
      })
    };
  });
});

//와인을 조회한다.
router.get('/all', (req, res) => {
  //lean() -> 조회 속도 빠르게 하기 위함
  Wine.find().lean().exec((err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Wine Read Error - '+err.message});
    }
    else {
      Wine.count({}, function(err, c){
        return res.json({
          data : results,
          size : c
        });
      })
    };
  });
});

//와인을 수정한다.
router.put('/', (req, res) => {
  Wine.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Wine Modify Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

//와인을 삭제한다.
router.delete('/', (req, res) => {
  Vintage.find({id_wine:req.body.data._id}).exec((err,vintages) =>{
    //연결된 상품 null로 변경
    for(var i=0; i<vintages.length;i++){
      Store.update({id_vintage:vintages[i]._id}, {$set:{id_vintage:null}}, (err, updateresult) => {
        if(err){
          console.error(err);
          return res.status(500).json({message : 'Store modify error(while delete vintage)'+ err.message});
        }
        else{
          if(updateresult){console.log(updateresult)};
        }
      });
    }
    //연결된 빈티지 삭제
    Vintage.remove({id_wine:req.body.data._id}).exec((err,result)=>{
      console.log('related vintage removed(remove wine)');
    })
  })
  Wine.remove({_id:req.body.data._id}, (err, results) => {
    if(err) {
      console.error(err);
      return res.status(500).json({message:'Wine Delete Error - '+err.message});
    }
    else {
      return res.json({
        data : results
      });
    }
  });
});

export default router;
