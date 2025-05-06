const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());
app.use(express.json());

const LUMA_API_KEY = "luma-c3a8c02e-edb8-4504-9906-896ce721e0ea-54eeba50-4a52-4db4-9b99-d7377e3790ce";

app.post("/generate", async (req, res) => {
  const imageUrls = req.body.imageUrls;

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return res.status(400).json({ error: "No imageUrls provided." });
  }

  // ✅ keyframes 객체 만들기
  const keyframes = {};
  imageUrls.forEach((url, index) => {
    keyframes[`frame${index}`] = {
      type: "image",
      url: url
    };
  });

  try {
    const response = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LUMA_API_KEY}`
      },
      body: JSON.stringify({
        prompt: "gimbal and drone operated video",
        keyframes: keyframes,
        aspect_ratio: "16:9",
        quality: "low",
        duration: 5,
        loop: false
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    // ✅ Luma 응답에 ID가 있으면 클라이언트에 전송
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/status/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const statusRes = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${id}`, {
      headers: { Authorization: `Bearer ${LUMA_API_KEY}` }
    });

    const statusData = await statusRes.json();
    res.json(statusData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Luma Proxy running on port 3000");
});
