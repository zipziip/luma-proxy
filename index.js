const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());
app.use(express.json());

const LUMA_API_KEY = "luma-493eaa8a-4a0d-4d63-bbf3-2acad14a9c2b-15effffa-c881-4306-bdb2-69738962e09f";

app.post("/generate", async (req, res) => {
  const imageUrl = req.body.imageUrl;
  const response = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LUMA_API_KEY}`
    },
    body: JSON.stringify({
      prompt: "gimbal and drone operated video",
      keyframes: {
        frame0: { type: "image", url: imageUrl }
      },
      quality: "low",
      duration: 9,
      aspect_ratio: "16:9",
      loop: false
    })
  });
  const data = await response.json();
  res.json(data);
});

app.get("/status/:id", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${id}`, {
    headers: { Authorization: `Bearer ${LUMA_API_KEY}` }
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Luma Proxy running"));
