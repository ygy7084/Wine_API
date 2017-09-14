import express from 'express';
import {Sale} from '../models';

const router = express.Router();

//sale을 만든다.
router.post('/', (req, res) => {
    const sale = new Sale(req.body.data);
    sale.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'sale Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});


//num개의 sale를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
    const num = req.params.num;
    const page = req.params.page;

    Sale.find().skip(num*page).limit(Number(num)).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Sale Read Error - '+err.message});
        }
        else {
          Sale.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});

//sale을 조회한다(조건x 여러개).
router.get('/list', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Sale.find().limit(20).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'sale Read Error - '+err.message});
        }
        else {
          Sale.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});

//sale 개별 조회
router.get('/list/:_id', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Sale.findOne({_id: req.params._id}).lean().exec((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Sale Read Error - '+err.message});
        }
        else {
            return res.json({
                data : result     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                //total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
            });
        }
    });
});

// sale을 수정한다.
router.put('/', (req, res) => {
    Sale.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Sale Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//sale 삭제한다.
router.delete('/', (req, res) => {
    Sale.remove({_id:req.body.data._id}, (err, results) => {
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
