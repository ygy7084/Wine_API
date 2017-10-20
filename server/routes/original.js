import express from 'express';
import multer from 'multer';
import async from 'async';
import fs from 'fs';
import path from 'path';
import { Original } from '../models';
import { Vintage } from '../models';
import { Store } from '../models';
import { Sale } from '../models';
import {
  isObjectHasValidString,
} from './modules';

const imagePath = 'public/img/';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, imagePath);
  },
  filename(req, file, cb) {
    cb(null, `${new Date().getTime()}${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

function originalStringMaker(original) {
  const result = original;
  // 와인 생산지 (검색 및 쉬운 조회를 위함)
  let location = '';
  if (result.country && result.country !== '') {
    location += `${result.country}`;
  }
  if (result.region && result.region !== '') {
    location += `/${result.region}`;
  }
  if (result.subregion && result.subregion !== '') {
    location += `/${result.subregion}`;
  }
  result.locationString = location;

  // 포도 종류 (검색 및 쉬운 조회를 위함)
  let grapes = '';
  for (const i in result.grape_race) {
    grapes += result.grape_race[i];
    if (i < result.grape_race.length - 1) {
      grapes += '/';
    }
  }
  result.grapeString = grapes;
  return result;
}


// original을 추가한다.
router.post('/', upload.single('file'), (req, res) => {
  const parsedData = JSON.parse(req.body.data);
  const dataWithString = originalStringMaker(parsedData);
  if (
    !isObjectHasValidString(dataWithString, 'eng_shortname') ||
    !isObjectHasValidString(dataWithString, 'kor_shortname')
  ) {
    if (req.file) {
      fs.unlink(req.file.path, () =>
        res.status(500).json({ message: '오리지날 생성 오류: 와인 이름 줄임말은 필수입니다.' }));
    } else {
      return res.status(500).json({ message: '오리지날 생성 오류: 와인 이름 줄임말은 필수입니다.' });
    }
  }
  const original = new Original(dataWithString);
  original.save((err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(req.file.path, () =>
          res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' }));
      } else {
        return res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' });
      }
    } else if (req.file) {
      const filePath = req.file.path;
      const newFileName = `${result._id}${path.extname(filePath)}`;
      fs.rename(filePath, `${path.dirname(filePath)}/${newFileName}`, () => {
        Original.findOneAndUpdate(
          { _id: result._id },
          { photo_url: newFileName },
          (err, result) => {
            if (err) {
              fs.unlink(req.file.path, () =>
                res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' }));
            }
            result.photo_url = newFileName;
            return res.json({
              data: result,
            });
          },
        );
      });
    } else {
      return res.json({
        data: result,
      });
    }
  });
});
router.post('/bulk', (req, res) => {
  if (!req.body.data || !req.body.data.length) {
    return res.status(500).json({ message: '데이터가 잘못 입력되었습니다.' });
  }
  const arr = req.body.data;
  Original.insertMany(arr.map(obj => {
    return {
      eng_shortname: obj.eng_shortname,
      kor_shortname: obj.kor_shortname,
      eng_fullname: obj.eng_fullname,
      kor_fullname: obj.kor_fullname,
    }
  }), (err, docs) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '데이터가 잘못 입력되었습니다.' });
    }
    return res.json({
      data: docs,
    });
  });
});
// num개의 오리지날을 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', (req, res) => {
  const num = req.params.num;
  const page = req.params.page;
  Original.find().skip(Number(num * page)).limit(Number(num)).lean()
    .exec((err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: `Original Read Error - ${err.message}` });
      }

      Original.count({}, (err, c) => res.json({
        data: results,
        size: c,
      }));
    });
});
// 오리지날을 조회한다.
router.get('/list', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Original.find().limit(20).lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Original Read Error - ${err.message}` });
    }

    Original.count({}, (err, c) => res.json({
      data: results,
      size: c,
    }));
  });
});
// 오리지날 개별조회(테스트용).
router.get('/list/:_id', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Original.find({ _id: req.params._id }).lean().exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Original Read Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
// 오리지날을 조회한다.
router.get('/all', (req, res) => {
  // lean() -> 조회 속도 빠르게 하기 위함
  Original.find()
    .lean()
    .sort({ eng_shortname: 1})
    .exec((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Original Read Error - ${err.message}` });
    }

    return res.json({
      data: results,
    });
  });
});
// 오리지날을 수정한다.
/*
const Original = new Schema({
    eng_fullname : String,
    eng_shortname : String,
    kor_fullname : String,
    kor_shortname : String,
    category : String,
    country : String,
    region : String,
    subregion : String,
    desc : String,
    photo_url : String,
    grape_race : [{name : String}],
    locationString : String,
    grapeString : String,
});
 */
router.put('/', upload.single('file'), (req, res) => {
  const parsedData = JSON.parse(req.body.data);
  const dataWithString = originalStringMaker(parsedData);
  if (!dataWithString._id) {
    if (req.file) {
      fs.unlink(req.file.path, () =>
        res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' }));
    } else {
      res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
    }
  }
  const properties = [
    'eng_fullname',
    'eng_shortname',
    'kor_fullname',
    'kor_shortname',
    'category',
    'country',
    'region',
    'subregion',
    'desc',
    'grape_race',
    'locationString',
    'grapeString',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(dataWithString, property)) {
      update.$set[property] = dataWithString[property];
    }
  }
  Original.findOneAndUpdate(
    { _id: parsedData._id },
    update,
    (err, result) => {
      if (err) {
        if (req.file) {
          fs.unlink(req.file.path, () =>
            res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' }));
        } else {
          res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
        }
      }
      if (req.file) {
        fs.unlink(`${imagePath}${result.photo_url}`, () => {
          const filePath = req.file.path;
          const newFileName = `${result._id}${path.extname(filePath)}`;
          fs.rename(filePath, `${path.dirname(filePath)}/${newFileName}`, () => {
            Original.findOneAndUpdate(
              { _id: result._id },
              { photo_url: newFileName },
              (err, result) => {
                if (err) {
                  fs.unlink(req.file.path, () =>
                    res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' }));
                }
                result.photo_url = newFileName;
                return res.json({
                  data: result,
                });
              },
            );
          });
        });
      } else {
        return res.json({
          data: result,
        });
      }
    },
  );
  return null;
});
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '오리지날 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  const SaleBulk = [];
  const VintageBulk = [];
  const OriginalBulk = [];
  const StoreBulk = [];
  const FileDeletions = [];
  OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  FileDeletions.push(function(cb) {
    fs.unlink(`${imagePath}${req.body.data.photo_url}`, () => cb(null));
  });
  async.waterfall([
    function(cb) {
      Vintage.find({
        original: req.body.data._id,
      }, (err, result) => {
        for (const obj of result) {
          VintageBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Sale.find({
        vintage: { $in: VintageBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        sale: { $in: SaleBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Vintage.bulkWrite(VintageBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Original.bulkWrite(OriginalBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    }
  ], () => {
    async.parallel(FileDeletions,
      function(err, results){
        return res.json({
          data: true,
        });
      });
  })
});
router.delete('/all', (req, res) => {
  const SaleBulk = [];
  const VintageBulk = [];
  const OriginalBulk = [];
  const StoreBulk = [];
  const FileDeletions = [];
  async.waterfall([
    function(cb){
      Original.find({}, (err,result) =>{
          for(const obj of result){
            OriginalBulk.push({
              deleteOne: {
                filter: { _id: obj._id }
              }
            });
            FileDeletions.push(function(cb) {
              fs.unlink(`${imagePath}${obj.photo_url}`, () => cb(null));
            });
          }
          cb(null);
      });
    },
    function(cb) {
      Vintage.find({
        original: { $in: OriginalBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          VintageBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Sale.find({
        vintage: { $in: VintageBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.find({
        sale: { $in: SaleBulk.map(obj => obj.deleteOne.filter._id)}
      }, (err, result) => {
        for (const obj of result) {
          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
        cb(null);
      });
    },
    function(cb) {
      Store.bulkWrite(StoreBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Sale.bulkWrite(SaleBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Vintage.bulkWrite(VintageBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      });
    },
    function(cb) {
      Original.bulkWrite(OriginalBulk).then((r) => {
        cb(null);
      }).catch((e) => {
        cb(null);
      })
    }
  ], () => {
    async.parallel(FileDeletions, () => {
      return res.json({
        data: true,
      });
    });
  })
});
export default router;
