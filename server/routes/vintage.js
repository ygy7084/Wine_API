import express from 'express';
import {Show} from '../models';

const router = express.Router();

//빈티지를 만든다.
router.post('/', (req, res) => {
    const show = new Show(req.body.data);
    show.save((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Create Error - '+err.message});
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

    Wine.find().skip(num*page).limit(num).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Wine Read Error - '+err.message});
        }
        else {
            return res.json({
                data : [results],     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
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
            return res.json({
                data : [results],     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
            });
        }
    });
});

//공연을 수정한다.
router.put('/', (req, res) => {
    Show.update({_id:req.body.data._id}, {$set: req.body.data}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Modify Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연을 삭제한다.
router.delete('/', (req, res) => {
    Show.remove({_id:req.body.data._id}, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Delete Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

export default router;
