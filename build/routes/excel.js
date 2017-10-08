'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// 파일 업로드 모듈. 최대 사이즈 : 30MB
var upload = (0, _multer2.default)({
  storage: _multer2.default.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 30 }
});
router.post('/tabletoexcel', function (req, res) {
  if (!req.body.data) {
    res.status(500).json({ message: '데이터 전송에 에러가 있습니다.' });
  }
  var _req$body$data = req.body.data,
      cols = _req$body$data.cols,
      rows = _req$body$data.rows;

  var wb = _xlsx2.default.utils.book_new();
  var ws_data = [];
  ws_data.push(cols);
  if (rows && rows.length) {
    ws_data = ws_data.concat(rows);
  }
  var ws = _xlsx2.default.utils.aoa_to_sheet(ws_data);
  wb.SheetNames.push('data');
  wb.Sheets['data'] = ws;
  _tmp2.default.file(function (error, path) {
    if (error) {
      return res.status(500).json({ message: '엑셀 생성 오류: 오류가 있습니다.', error: error });
    }
    _xlsx2.default.writeFile(wb, path);
    return res.download(path, 'data.xlsx');
  });
});
router.post('/exceltotable/:mode', upload.single('file'), function (req, res) {
  var mode = req.params.mode;

  if (!mode) {
    return res.status(500).json({ message: '잘못된 주소로 요청되었습니다.' });
  }
  var ExceFileBuffer = req.file.buffer;
  var ExcelFile = _xlsx2.default.read(ExceFileBuffer);
  var ExcelSheet = ExcelFile.Sheets[ExcelFile.SheetNames[0]];
  var ExcelSheetRange = _xlsx2.default.utils.decode_range(ExcelSheet['!ref'].toString());
  var columnsParser = {};
  if (mode === 'original') {
    columnsParser = {
      eng_shortname: {
        index: 0
      },
      kor_shortname: {
        index: 1
      },
      eng_fullname: {
        index: 2
      },
      kor_fullname: {
        index: 3
      }
    };
  }
  var data = [];
  try {
    for (var r = ExcelSheetRange.s.r + 1; r <= ExcelSheetRange.e.r; r += 1) {
      var datum = {};
      for (var col in columnsParser) {
        var cellAddress = _xlsx2.default.utils.encode_cell({ c: columnsParser[col].index, r: r });
        datum[col] = ExcelSheet[cellAddress] ? ExcelSheet[cellAddress].v : '';
      }
      data.push(datum);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: '엑셀 입력 오류: 올바른 엑셀이 입력되지 않았습니다.' });
  }
  return res.json({ data: data });
});
exports.default = router;