import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import tmp from 'tmp';

const router = express.Router();

// 파일 업로드 모듈. 최대 사이즈 : 30MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 30 },
});
router.post('/tabletoexcel', (req, res) => {
  if (!req.body.data) {
    res.status(500).json({ message: '데이터 전송에 에러가 있습니다.' });
  }
  const { cols, rows } = req.body.data;
  const wb = xlsx.utils.book_new();
  let ws_data = [];
  ws_data.push(cols);
  if (rows && rows.length) {
    ws_data = ws_data.concat(rows);
  }
  const ws = xlsx.utils.aoa_to_sheet(ws_data);
  wb.SheetNames.push('data');
  wb.Sheets['data'] = ws;
  tmp.file((error, path) => {
    if (error) {
      return res.status(500).json({ message: '엑셀 생성 오류: 오류가 있습니다.', error });
    }
    xlsx.writeFile(wb, path);
    return res.download(path, 'data.xlsx');
  });
});
router.post('/exceltotable/:mode', upload.single('file'), (req, res) => {
  const { mode } = req.params;
  if (!mode) {
    return res.status(500).json({ message: '잘못된 주소로 요청되었습니다.' });
  }
  const ExceFileBuffer = req.file.buffer;
  const ExcelFile = xlsx.read(ExceFileBuffer);
  const ExcelSheet = ExcelFile.Sheets[ExcelFile.SheetNames[0]];
  const ExcelSheetRange = xlsx.utils.decode_range(ExcelSheet['!ref'].toString());
  let columnsParser = {};
  if (mode === 'original') {
    columnsParser = {
      eng_shortname: {
        index: 0,
      },
      kor_shortname: {
        index: 1,
      },
      eng_fullname: {
        index: 2,
      },
      kor_fullname: {
        index: 3,
      },
    };
  }
  const data = [];
  try {
    for (let r = ExcelSheetRange.s.r + 1; r <= ExcelSheetRange.e.r; r += 1) {
      const datum = {};
      for (const col in columnsParser) {
        const cellAddress = xlsx.utils.encode_cell({ c: columnsParser[col].index, r });
        datum[col] = ExcelSheet[cellAddress] ? ExcelSheet[cellAddress].v : '';
      }
      data.push(datum);
    }
  } catch (e) {
    return res.status(500).json({ message: '엑셀 입력 오류: 올바른 엑셀이 입력되지 않았습니다.' });
  }
  return res.json({ data });
});
export default router;
