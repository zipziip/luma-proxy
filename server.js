const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let customers = {}; // 임시 저장

// ✅ 하루 1회 도장 적립 API
app.post('/stamp-auto', (req, res) => {
  const { businessId, userId } = req.body;
  const key = `${businessId}_${userId}`;
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD

  if (!customers[key]) {
    customers[key] = { stampCount: 0, businessId, userId, lastStampedDate: "" };
  }

  if (customers[key].lastStampedDate === today) {
    return res.status(200).json({
      alreadyStamped: true,
      stampCount: customers[key].stampCount
    });
  }

  customers[key].stampCount++;
  customers[key].lastStampedDate = today;

  res.status(200).json({
    alreadyStamped: false,
    stampCount: customers[key].stampCount
  });
});

// ✅ 도장 조회
app.get('/stamp/:businessId/:userId', (req, res) => {
  const key = `${req.params.businessId}_${req.params.userId}`;
  res.json(customers[key] || { stampCount: 0 });
});

// ✅ 도장 수정
app.patch('/stamp/:id', (req, res) => {
  const id = req.params.id;
  const delta = req.body.delta;
  customers[id].stampCount = Math.max(0, (customers[id].stampCount || 0) + delta);
  res.json(customers[id]);
});

// ✅ 도장 리셋
app.delete('/stamp/:id', (req, res) => {
  if (customers[id]) customers[id].stampCount = 0;
  res.sendStatus(204);
});

app.listen(3000, () => console.log('🎯 Stamp API running'));
