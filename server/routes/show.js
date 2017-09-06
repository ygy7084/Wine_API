import express from 'express';
import {Show} from '../models';

const router = express.Router();

//공연을 만든다.
router.post('/create', (req, res) => {
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

//공연을 조회한다.
router.get('/read/:key_name/:key_value', (req, res) => {
    const key_name = req.params.key_name;
    const key_value = req.params.key_value;

    const keys = ['_id'];

    if(keys.indexOf(key_name) < 0)
        return res.status(500).json({message:'Show Read Error - '+'잘못된 key 이름을 입력하셨습니다 : '+key_name});

    let query = {};
    query[key_name] = key_value;

    //lean() -> 조회 속도 빠르게 하기 위함
    Show.find(query).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});
//공연을 조회한다.
router.get('/read', (req, res) => {
    //lean() -> 조회 속도 빠르게 하기 위함
    Show.find({}).lean().exec((err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message:'Show Read Error - '+err.message});
        }
        else {
            return res.json({
                data : results
            });
        }
    });
});

//공연을 수정한다.
router.put('/update', (req, res) => {
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
router.delete('/delete', (req, res) => {
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
