import express from 'express';
import {Category} from '../models';

const router = express.Router();

//Location을 만든다.
router.post('/', (req, res) => {
    const category = new Category(req.body.data);
    category.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'category Create Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

/*
//num개의 Location를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
    const num = req.params.num;
    const page = req.params.page;

    Location.find().skip(num*page).limit(Number(num)).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Location Read Error - '+err.message});
        }
        else {
          Location.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});

//Location을 조회한다(조건x 여러개).
router.get('/list', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Location.find().limit(20).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Location Read Error - '+err.message});
        }
        else {
          Location.count({},function(err, c){
            return res.json({
                data : results,
                size : c
            });
          });
        }
    });
});

//Location 개별 조회
router.get('/list/:_id', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Location.findOne({_id: req.params._id}).lean().exec((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Location Read Error - '+err.message});
        }
        else {
            return res.json({
                data : result     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                //total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
            });
        }
    });
});

// Location을 수정한다.
router.put('/', (req, res) => {
    Location.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Location Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});
*/
//Location 삭제한다.
router.delete('/', (req, res) => {
    Category.remove({_id:req.body.data._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Category Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

export default router;
