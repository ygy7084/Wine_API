'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _models = require('../models');

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imagePath = 'public/uploads/img/';

var storage = _multer2.default.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, imagePath);
  },
  filename: function filename(req, file, cb) {
    cb(null, '' + new Date().getTime() + file.originalname);
  }
});

var upload = (0, _multer2.default)({ storage: storage });
var router = _express2.default.Router();

function originalStringMaker(original) {
  var result = original;
  // 와인 생산지 (검색 및 쉬운 조회를 위함)
  var location = '';
  if (result.country && result.country !== '') {
    location += '' + result.country;
  }
  if (result.region && result.region !== '') {
    location += '/' + result.region;
  }
  if (result.subregion && result.subregion !== '') {
    location += '/' + result.subregion;
  }
  result.locationString = location;

  // 포도 종류 (검색 및 쉬운 조회를 위함)
  var grapes = '';
  for (var i in result.grape_race) {
    grapes += result.grape_race[i];
    if (i < result.grape_race.length - 1) {
      grapes += '/';
    }
  }
  result.grapeString = grapes;
  return result;
}

// original을 추가한다.
router.post('/', upload.single('file'), function (req, res) {
  var parsedData = JSON.parse(req.body.data);
  var dataWithString = originalStringMaker(parsedData);
  if (!(0, _modules.isObjectHasValidString)(dataWithString, 'eng_shortname') || !(0, _modules.isObjectHasValidString)(dataWithString, 'kor_shortname')) {
    if (req.file) {
      _fs2.default.unlink(req.file.path, function () {
        return res.status(500).json({ message: '오리지날 생성 오류: 와인 이름 줄임말은 필수입니다.' });
      });
    } else {
      return res.status(500).json({ message: '오리지날 생성 오류: 와인 이름 줄임말은 필수입니다.' });
    }
  }
  var original = new _models.Original(dataWithString);
  original.save(function (err, result) {
    if (err) {
      if (req.file) {
        _fs2.default.unlink(req.file.path, function () {
          return res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' });
        });
      } else {
        return res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' });
      }
    } else if (req.file) {
      var filePath = req.file.path;
      var newFileName = '' + result._id + _path2.default.extname(filePath);
      _fs2.default.rename(filePath, _path2.default.dirname(filePath) + '/' + newFileName, function () {
        _models.Original.findOneAndUpdate({ _id: result._id }, { photo_url: newFileName }, function (err, result) {
          if (err) {
            _fs2.default.unlink(req.file.path, function () {
              return res.status(500).json({ message: '오리지날 생성 오류: 에러가 있습니다.' });
            });
          }
          result.photo_url = newFileName;
          return res.json({
            data: result
          });
        });
      });
    } else {
      return res.json({
        data: result
      });
    }
  });
});
router.post('/bulk', function (req, res) {
  if (!req.body.data || !req.body.data.length) {
    return res.status(500).json({ message: '데이터가 잘못 입력되었습니다.' });
  }
  var arr = req.body.data;
  _models.Original.insertMany(arr.map(function (obj) {
    return {
      eng_shortname: obj.eng_shortname,
      kor_shortname: obj.kor_shortname,
      eng_fullname: obj.eng_fullname,
      kor_fullname: obj.kor_fullname
    };
  }), function (err, docs) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '데이터가 잘못 입력되었습니다.' });
    }
    return res.json({
      data: docs
    });
  });
});
// num개의 오리지날을 num*page + 1 번째 부터 조회한다.
router.get('/list/:num/:page', function (req, res) {
  var num = req.params.num;
  var page = req.params.page;
  _models.Original.find().skip(Number(num * page)).limit(Number(num)).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Original Read Error - ' + err.message });
    }

    _models.Original.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});
// 오리지날을 조회한다.
router.get('/list', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Original.find().limit(20).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Original Read Error - ' + err.message });
    }

    _models.Original.count({}, function (err, c) {
      return res.json({
        data: results,
        size: c
      });
    });
  });
});
// 오리지날 개별조회(테스트용).
router.get('/list/:_id', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Original.find({ _id: req.params._id }).lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Original Read Error - ' + err.message });
    }

    return res.json({
      data: results
    });
  });
});
// 오리지날을 조회한다.
router.get('/all', function (req, res) {
  // lean() -> 조회 속도 빠르게 하기 위함
  _models.Original.find().lean().exec(function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Original Read Error - ' + err.message });
    }

    return res.json({
      data: results
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
router.put('/', upload.single('file'), function (req, res) {
  var parsedData = JSON.parse(req.body.data);
  var dataWithString = originalStringMaker(parsedData);
  if (!dataWithString._id) {
    if (req.file) {
      _fs2.default.unlink(req.file.path, function () {
        return res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
      });
    } else {
      res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
    }
  }
  var properties = ['eng_fullname', 'eng_shortname', 'kor_fullname', 'kor_shortname', 'category', 'country', 'region', 'subregion', 'desc', 'grape_race', 'locationString', 'grapeString'];
  var update = { $set: {} };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      if (Object.prototype.hasOwnProperty.call(dataWithString, property)) {
        update.$set[property] = dataWithString[property];
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

  _models.Original.findOneAndUpdate({ _id: parsedData._id }, update, function (err, result) {
    if (err) {
      if (req.file) {
        _fs2.default.unlink(req.file.path, function () {
          return res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
        });
      } else {
        res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
      }
    }
    if (req.file) {
      _fs2.default.unlink('' + imagePath + result.photo_url, function () {
        var filePath = req.file.path;
        var newFileName = '' + result._id + _path2.default.extname(filePath);
        _fs2.default.rename(filePath, _path2.default.dirname(filePath) + '/' + newFileName, function () {
          _models.Original.findOneAndUpdate({ _id: result._id }, { photo_url: newFileName }, function (err, result) {
            if (err) {
              _fs2.default.unlink(req.file.path, function () {
                return res.status(500).json({ message: '오리지날 수정 오류: 에러가 있습니다.' });
              });
            }
            result.photo_url = newFileName;
            return res.json({
              data: result
            });
          });
        });
      });
    } else {
      return res.json({
        data: result
      });
    }
  });
  return null;
});
router.delete('/', function (req, res) {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '오리지날 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  var SaleBulk = [];
  var VintageBulk = [];
  var OriginalBulk = [];
  var StoreBulk = [];
  var FileDeletions = [];
  OriginalBulk.push({
    deleteOne: {
      filter: { _id: req.body.data._id }
    }
  });
  FileDeletions.push(function (cb) {
    _fs2.default.unlink('' + imagePath + req.body.data.photo_url, function () {
      return cb(null);
    });
  });
  _async2.default.waterfall([function (cb) {
    _models.Vintage.find({
      original: req.body.data._id
    }, function (err, result) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = result[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var obj = _step2.value;

          VintageBulk.push({
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
    _models.Sale.find({
      vintage: { $in: VintageBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = result[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var obj = _step3.value;

          SaleBulk.push({
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
    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = result[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var obj = _step4.value;

          StoreBulk.push({
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
    _models.Store.bulkWrite(StoreBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Vintage.bulkWrite(VintageBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Original.bulkWrite(OriginalBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    _async2.default.parallel(FileDeletions, function (err, results) {
      return res.json({
        data: true
      });
    });
  });
});
router.delete('/all', function (req, res) {
  var SaleBulk = [];
  var VintageBulk = [];
  var OriginalBulk = [];
  var StoreBulk = [];
  var FileDeletions = [];
  _async2.default.waterfall([function (cb) {
    _models.Original.find({}, function (err, result) {
      var _loop = function _loop(obj) {
        OriginalBulk.push({
          deleteOne: {
            filter: { _id: obj._id }
          }
        });
        FileDeletions.push(function (cb) {
          _fs2.default.unlink('' + imagePath + obj.photo_url, function () {
            return cb(null);
          });
        });
      };

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = result[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var obj = _step5.value;

          _loop(obj);
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
    _models.Vintage.find({
      original: { $in: OriginalBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = result[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var obj = _step6.value;

          VintageBulk.push({
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
    _models.Sale.find({
      vintage: { $in: VintageBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = result[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var obj = _step7.value;

          SaleBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    _models.Store.find({
      sale: { $in: SaleBulk.map(function (obj) {
          return obj.deleteOne.filter._id;
        }) }
    }, function (err, result) {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = result[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var obj = _step8.value;

          StoreBulk.push({
            deleteOne: {
              filter: { _id: obj._id }
            }
          });
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      cb(null);
    });
  }, function (cb) {
    _models.Store.bulkWrite(StoreBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Sale.bulkWrite(SaleBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Vintage.bulkWrite(VintageBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }, function (cb) {
    _models.Original.bulkWrite(OriginalBulk).then(function (r) {
      cb(null);
    }).catch(function (e) {
      cb(null);
    });
  }], function () {
    _async2.default.parallel(FileDeletions, function () {
      return res.json({
        data: true
      });
    });
  });
});
exports.default = router;