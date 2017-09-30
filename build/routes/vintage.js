'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _models = require('../models');

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// 빈티지를 만든다.

//import { Store } from '../models';
//import { Sale } from '../models';
router.post('/', function (req, res) {
  if (!Object.prototype.hasOwnProperty.call(req.body.data, 'original') || !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage')) {
    return res.status(500).json({ message: '빈티지 생성 오류: 올바른 값을 입력하십시요.' });
  }
  var vintage = new _models.Vintage({
    original: req.body.data.original,
    vintage: req.body.data.vintage
  });
  vintage.save(function (err, results) {
    if (err) {
      return res.status(500).json({ message: '빈티지 생성 오류: 중복된 빈티지가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// num개의 vintage를 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', function (req, res) {
  var num = req.params.num;
  var page = req.params.page;

  _models.Vintage.find().populate('id_wine').skip(num * page).limit(Number(num)).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Vintage Read Error - ' + err.message });
    }

    _models.Vintage.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});
// 빈티지를 조회한다(조건x 여러개).
router.get('/list', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Vintage.find().populate('id_wine').limit(20).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Vintage Read Error - ' + err.message });
    }

    _models.Vintage.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});
// 빈티지 전체 조회
router.get('/all', function (req, res) {
  _models.Vintage.find({}).populate('original').lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '빈티지 조회 오류: 에러가 있습니다.' });
    }

    return res.json({
      data: results
    });
  });
});

// 빈티지 개별 조회
router.get('/list/:_id', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Vintage.findOne({ _id: req.params._id }).populate('id_wine').lean().exec(function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Vintage Read Error - ' + err.message });
    }

    return res.json({
      data: result
    });
  });
});

// 빈티지를 수정한다.
router.put('/', function (req, res) {
  if (!Object.prototype.hasOwnProperty.call(req.body.data, '_id') || !Object.prototype.hasOwnProperty.call(req.body.data, 'vintage')) {
    return res.status(500).json({ message: '빈티지 생성 오류: 올바른 값을 입력하십시요.' });
  }
  var properties = ['vintage'];
  var update = { $set: {} };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
        update.$set[property] = req.body.data[property];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  _models.Vintage.findOneAndUpdate({ _id: req.body.data._id }, update, function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '빈티지 수정 오류: 중복된 빈티지가 있거나 오류가 있습니다.' });
    }
    return res.json({
      data: results
    });
  });
});

// 빈티지를 삭제한다. 연결된 Store 의 id_vintage는 null로 변경한다, 연결된 sale은 지운다.
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '빈티지 삭제 오류: _id가 전송되지 않았습니다.' });
  }

  var SaleBulk = [];
  var VintageBulk = [];
  //const OriginalBulk = [];
  var StoreBulk = [];

  VintigeBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });

  _async2.default.waterfall([function (cb) {
    console.log('1');

    _models.Sale.find({
      vintage: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = result[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var obj = _step2.value;

          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('2');

    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = result[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var obj = _step3.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('3');

    _models.Store.bulkWrite(StoreBulk, function (storeBulkResullt) {
      _models.Sale.bulkWrite(SaleBulk, function (saleBulkResult) {
        _models.Vintage.bulkWrite(VintageBulk, function (vintageBulkResult) {
          cb(null);
        });
      });
    });
  }], function () {
    console.log('4');

    return res.json({
      data: true
    });
  });

  // Store.updateMany({id_vintage:req.body.data._id}, {$set:{id_vintage:null}}, (err,callback)=>{
  //   Sale.remove({id_vintage:req.body.data._id}, (err,result)=>{
  //     if(err){
  //       console.error(err);
  //       return res.status(500).json({message: 'Related Sale remove error while removing Vintage - '+err.message})
  //     }
  //     else{
  //       Vintage.remove({_id:req.body.data._id}, (err, results) => {
  //         if(err) {
  //           console.error(err);
  //           return res.status(500).json({message:'Vintage Delete Error - '+err.message});
  //         }
  //         else {
  //           console.log('vintage removed'+results);
  //         }
  //       });
  //     }
  //   })
  // });
  // return res.json({
  //   success : true
  // })
});

router.delete('/all', function (req, res) {

  var SaleBulk = [];
  var VintageBulk = [];
  var StoreBulk = [];

  /*OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });*/

  _async2.default.waterfall([function (cb) {
    console.log('0');
    _models.Vintage.find({}, function (err, result) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = result[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var obj = _step4.value;

          VintageBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('1');

    _models.Sale.find({
      vintage: { $in: VintageBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = result[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var obj = _step5.value;

          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('2');

    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = result[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var obj = _step6.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    console.log('3');

    _models.Store.bulkWrite(StoreBulk, function (storeBulkResullt) {
      _models.Sale.bulkWrite(SaleBulk, function (saleBulkResult) {
        _models.Vintage.bulkWrite(VintageBulk, function (vintageBulkResult) {
          cb(null);
        });
      });
    });
  }], function () {
    console.log('4');

    return res.json({
      data: true
    });
  });
});

exports.default = router;