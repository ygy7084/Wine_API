import express from 'express';
import {
  Account,
} from '../models';
import {
  isObjectHasValidString,
} from './modules';

const router = express.Router();

// 계정 생성
router.post('/', (req, res) => {
  if (
    !isObjectHasValidString(req.body.data, 'username') ||
    !isObjectHasValidString(req.body.data, 'password')
  ) {
    return res.status(500).json({ message: '계정 생성 오류: 아이디와 비밀번호를 입력해주십시요.' });
  }
  const accountTemp = {
    username: req.body.data.username,
    password: req.body.data.password,
    name: req.body.data.name,
    level: req.body.data.level,
    shop: req.body.data.shop,
  };
  const account = new Account(accountTemp);
  account.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '계정 생성 오류: 중복된 아이디가 존재하거나 오류가 있습니다.' });
    }
    return res.json({
      data: result,
    });
  });
  return null;
});

// 계정 반환
router.get('/:_id', (req, res) => {
  Account.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '계정 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 계정 리스트 반환
router.get('/', (req, res) => {
  Account.find({})
    .populate('shop')
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '계정 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 계정 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '계정 수정 오류: _id가 전송되지 않았습니다.' });
  }
  if (
    !isObjectHasValidString(req.body.data, 'username') ||
    !isObjectHasValidString(req.body.data, 'password')
  ) {
    return res.status(500).json({ message: '계정 수정 오류: 아이디와 비밀번호를 입력해주십시요.' });
  }
  const properties = [
    'username',
    'password',
    'name',
    'level',
    'shop',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Account.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '계정 수정 오류: 아이디가 중복되거나 에러가 발생했습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});

// 계정 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '계정 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Account.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) =>
      res.json({
        data: result,
      }),
  );
  return null;
});

// 계정 전부 삭제
router.delete('/all', (req, res) => {
  Account.deleteMany(
    {},
    (err) => {
      if (err) {
        return res.status(500).json({ message: '계정 삭제 오류: DB 삭제에 문제가 있습니다.' });
      }
      const account = new Account({
        username: '0',
        password: '0',
        name: '초기관리자',
      });
      account.save((err, result) => {
        if (err) {
          return res.status(500).json({ message: '계정 삭제 오류: 초기 관리자 계정 생성에 문제가 있습니다. 수동으로 DB를 접속하십시요.' });
        }
        return res.json({
          data: result,
        });
      });
    },
  );
  return null;
});

export default router;
