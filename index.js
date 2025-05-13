const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const LUMA_API_KEY = "여기에_당신의_Luma_API_키_입력"; // ❗ 꼭 바꾸세요

app.post("/generate", async (req, res) => {
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

  try {
    const genRes = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LUMA_API_KEY}`
      },
      body: JSON.stringify({
        prompt: "gimbal and drone operated video",
        keyframes: {
          frame0: {
            type: "image",
            url: imageUrl
          }
        },
        aspect_ratio: "16:9",
        loop: false
      })
    });

    const genData = await genRes.json();
    res.json(genData);
  } catch (e) {
    res.status(500).json({ error: e.message });
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Luma Proxy is running");
});
