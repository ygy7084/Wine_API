import express from 'express';
import {Wine} from '../models';

const router = express.Router();

// wine을 만든다.
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
            return res.json({
                data : results     //정보 받아와서 어떤 형태로 results에 들어가는지 모르겠음.
                //total : Wine.size()   // 이렇게 쓰는게 맞는 것인가.
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



export default router;
