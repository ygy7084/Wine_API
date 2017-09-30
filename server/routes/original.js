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

const imagePath = 'public/uploads/img/';

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
  Original.find().lean().exec((err, results) => {
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
// 오리지날을 삭제한다.
// router.delete('/', (req, res) => {
//   Vintage.find({id_original:req.body.data._id}).exec((err,vintages) =>{
//     if(err){
//       console.error(err);
//       return res.status(500).json({message : 'Vintage find error (while delete vintage)'+ err.message});
//     }
//     else{
//       for(var i=0; i<vintages.length;i++){
//         //연결된 입출고 null로 변경
//         Store.updateMany({id_vintage:vintages[i]._id}, {$set:{id_vintage:null}}, (err, updateresult) => {
//           if(err){
//             console.error(err);
//             return res.status(500).json({message : 'Store modify error(while delete vintage)'+ err.message});
//           }
//           else{
//             console.log('related Store modified');
//           }
//         });
//         //연결된 sale 삭제
//         Sale.remove({id_vintage:vintages[i]._id}, (err, result) => {
//           //연결된 빈티지 삭제
//           Vintage.remove({id_original:req.body.data._id}, (err,result)=>{
//             console.log('related vintage removed(remove original)');
//             Original.remove({_id:req.body.data._id}, (err, results) => {
//               if(err) {
//                 console.error(err);
//                 return res.status(500).json({message:'Original Delete Error - '+ err.message});
//               }
//               else {
//                 console.log('Original deleted');
//               }
//             });
//           })
//         });
//       }
//       return res.json({
//         success : true
//       })
//     }
//   })
// });
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '오리지날 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  console.log(req.body.data._id);

  const SaleBulk = [];
  const VintageBulk = [];
  const OriginalBulk = [];
  const StoreBulk = [];

  OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });

  async.waterfall([

    function(cb) {
      console.log('1');

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
      console.log('2');

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
      console.log('3');

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
      console.log('4');

      Store.bulkWrite(StoreBulk, (storeBulkResullt) => {
        Sale.bulkWrite(SaleBulk, (saleBulkResult) => {
          Vintage.bulkWrite(VintageBulk, (vintageBulkResult) => {
            Original.bulkWrite(OriginalBulk, (originalBulkResult) => {
              cb(null);
            })
          })
        })
      });
    },
  ], () => {
    console.log('5');

    return res.json({
      data: true,
    });
  })
});



  // Vintage.find({original:req.body.data._id}).exec((err, vintages) =>{
  //   console.log(vintages);
  //   if(err){
  //     console.error(err);
  //     return res.status(500).json({message : 'Vintage find error (while removing original)' + err.message});
  //   }
  //   else{
  //     if(!vintages.length){
  //       Original.remove(
  //         { _id: req.body.data._id },
  //         (err, result) => {
  //           if (err) {
  //             console.error(err);
  //             return res.status(500).json({ message: `Original Delete Error - ${err.message}` });
  //           }
  //           //fs.unlink(`${imagePath}${result.photo_url}`, () => res.json({
  //           //  data: result,
  //           //}));
  //         },
  //       );
  //     }
  //     else {
  //       for (var i = 0; i < vintages.length; i++) {
  //         //연결된 입출고 삭제
  //
  //         //연결된 sale 삭제
  //         //console.log('i : '+i);
  //         Sale.find({vintage:vintages[i]._id}, (err,Sales)=>{
  //           console.log(Sales);
  //           for(var j = 0; j < Sales.length; j++){
  //             Store.remove({sale:Sales[0]._id}, (err, storedelete) =>{
  //               //Sale.
  //               Vintage.remove({_id: vintages[i]._id}, (err, result) => {
  //                 console.log('related vintage removed(remove original)');
  //                 Original.remove(
  //                   { _id: req.body.data._id },
  //                   (err, originalresult) => {
  //                     if (err) {
  //                       console.error(err);
  //                       return res.status(500).json({ message: `Original Delete Error - ${err.message}` });
  //                     }
  //                     //fs.unlink(`${imagePath}${result.photo_url}`, () => res.json({
  //                     //  data: result,
  //                     //}));
  //                   },
  //                 );
  //               })
  //             })
  //           }
  //         })
  //       }
  //     }
  //   }
  //})
  // Vintage.find({id_original:req.body.data._id}).exec((err,vintages) =>{
  //   if(err){
  //     console.error(err);
  //     return res.status(500).json({message : 'Vintage find error (while delete vintage)'+ err.message});
  //   }
  //   else {
  //     if (!vintage.length) {
  //       Original.remove({_id:req.body.data._id}, (err, results) => {
  //         if(err) {
  //           console.error(err);
  //           return res.status(500).json({message:'Original Delete Error - '+ err.message});
  //         }
  //         else {
  //           console.log('Original deleted');
  //         }
  //       });
  //     } else {
  //       for (var i = 0; i < vintages.length; i++) {
  //         //연결된 입출고 null로 변경
  //         Store.updateMany({id_vintage: vintages[i]._id}, {$set: {id_vintage: null}}, (err, updateresult) => {
  //           if (err) {
  //             console.error(err);
  //             return res.status(500).json({message: 'Store modify error(while delete vintage)' + err.message});
  //           }
  //           else {
  //             console.log('related Store modified');
  //           }
  //         });
  //         //연결된 sale 삭제
  //         Sale.remove({id_vintage: vintages[i]._id}, (err, result) => {
  //           //연결된 빈티지 삭제
  //           Vintage.remove({id_original: req.body.data._id}, (err, result) => {
  //             console.log('related vintage removed(remove original)');
  //             Original.remove({_id: req.body.data._id}, (err, results) => {
  //               if (err) {
  //                 console.error(err);
  //                 return res.status(500).json({message: 'Original Delete Error - ' + err.message});
  //               }
  //               else {
  //                 console.log('Original deleted');
  //               }
  //             });
  //           })
  //         });
  //       }
  //       return res.json({
  //         success: true
  //       })
  //     }
  //   }
  // })


router.delete('/all', (req, res) => {


  const SaleBulk = [];
  const VintageBulk = [];
  const OriginalBulk = [];
  const StoreBulk = [];

  /*OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });*/

  async.waterfall([
    function(cb){
      console.log('0');
      Original.find({}, (err,result) =>{
          for(const obj of result){
            OriginalBulk.push({
              deleteOne: {
                filter: { _id: obj._id }
              }
            })
          }
          cb(null);
      });
    },

    function(cb) {
      console.log('1');

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
      console.log('2');

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
      console.log('3');

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
      console.log('4');

      Store.bulkWrite(StoreBulk, (storeBulkResullt) => {
        Sale.bulkWrite(SaleBulk, (saleBulkResult) => {
          Vintage.bulkWrite(VintageBulk, (vintageBulkResult) => {
            Original.bulkWrite(OriginalBulk, (originalBulkResult) => {
              cb(null);
            })
          })
        })
      });
    },
  ], () => {
    console.log('5');

    return res.json({
      data: true,
    });
  })
});





export default router;
