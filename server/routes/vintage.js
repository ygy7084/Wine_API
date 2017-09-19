import express from 'express';
import {Vintage} from '../models';
import {Store} from '../models';

const router = express.Router();

//빈티지를 만든다.
router.post('/', (req, res) => {
    const vintage = new Vintage(req.body.data);
    vintage.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Vintage Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});


//num개의 vintage를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
    const num = req.params.num;
    const page = req.params.page;

    Vintage.find().populate('id_wine').skip(num*page).limit(Number(num)).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Vintage Read Error - '+err.message});
        }
        else {
          Vintage.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});

//빈티지를 조회한다(조건x 여러개).
router.get('/list', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Vintage.find().populate('id_wine').limit(20).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Vintage Read Error - '+err.message});
        }
        else {
          Vintage.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});
//빈티지 전체 조회
router.get('/all', (req, res) =>{
  Vintage.find({}).populate('id_wine').lean().exec((err,results) => {
    if(err){
      console.error(err);
      return res.status(500).json({message:'Vintage Read Error(All) - '+err.message});
    }
    else{
      Vintage.count({}, function(err,c){
        return res.json({
          data : results,
          size : c
        });
      });
    }
  });
});


//빈티지 개별 조회
router.get('/list/:_id', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Vintage.findOne({_id: req.params._id}).populate('id_wine').lean().exec((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Vintage Read Error - '+err.message});
        }
        else {
            return res.json({
                data : result
            });
        }
    });
});

//빈티지를 수정한다.
router.put('/', (req, res) => {
    Vintage.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Vintage Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//빈티지를 삭제한다. 연결된 Store 의 id_vintage는 null로 변경한다.
router.delete('/', (req, res) => {
    Store.update({id_vintage:req.body.data._id}, {$set:{id_vintage:null}}, (err,result)=>{
      Vintage.remove({_id:req.body.data._id}, (err, results) => {
          if(err) {
              console.error(err);
              return res.status(500).json({message:'Vintage Delete Error - '+err.message});
          }
          else {
              return res.json({
                  data : results
              });
          }
      });
    });
});

export default router;
