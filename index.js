const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const LUMA_API_KEY = "luma-493eaa8a-4a0d-4d63-bbf3-2acad14a9c2b-15effffa-c881-4306-bdb2-69738962e09f"; // 실제 키로 교체하세요

// POST /generate → 이미지 URL로 영상 생성 요청
app.post("/generate", async (req, res) => {
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

  try {
    const response = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LUMA_API_KEY}`
      },
      body: JSON.stringify({
        model: "ray-flash-2", // ✅ 모델은 유지
        prompt: "gimbal and drone 360 operated video",
        keyframes: {
          frame0: {
            type: "image",
            url: imageUrl
          }
        },
        quality: "low",
        aspect_ratio: "16:9",
        loop: false
        // ⛔ duration 필드 제거됨
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error in /generate:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /status/:id → 생성된 비디오 상태 확인
app.get("/status/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Missing generation ID" });

  try {
    const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${id}`, {
      headers: { Authorization: `Bearer ${LUMA_API_KEY}` }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Error in /status:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Luma Proxy running on port 3000");
});
