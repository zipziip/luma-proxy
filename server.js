const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'visits.json');

app.use(cors());
app.use(express.json());

// ✅ 로컬 JSON DB 로드
function loadData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// ✅ 저장
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ 하루 1회 스탬프 적립
app.post('/stamp', (req, res) => {
  const { userId, businessId } = req.body;
  if (!userId || !businessId) return res.status(400).json({ error: 'Missing fields' });

  const db = loadData();
  const key = `${userId}_${businessId}`;
  const today = new Date().toISOString().split('T')[0];

  if (db[key] === today) {
    return res.status(429).json({ message: 'Already stamped today' });
  }

  db[key] = today;
  saveData(db);

  return res.json({ success: true, message: 'Stamp recorded' });
});

// ✅ 적립 여부 확인
app.get('/check', (req, res) => {
  const { userId, businessId } = req.query;
  if (!userId || !businessId) return res.status(400).json({ error: 'Missing fields' });

  const db = loadData();
  const key = `${userId}_${businessId}`;
  const today = new Date().toISOString().split('T')[0];

  const stamped = db[key] === today;
  res.json({ stamped });
});

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
