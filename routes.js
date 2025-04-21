const express = require("express");
const axios = require("axios");

const router = express.Router();

// Hardcoded Gemini API key (NOT RECOMMENDED)
const GEMINI_API_KEY = "AIzaSyCr0O-TXmA74HJj0EOWNBsMVEwNbi6CivU"; // Replace with your actual Gemini API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post("/generate-resume", async (req, res) => {
  const { userPrompt } = req.body;
  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts: [{ text: userPrompt }] }],
    });

    if (response.data.candidates && response.data.candidates.length > 0) {
      res.json({ resume: response.data.candidates[0].content.parts[0].text });
    } else {
      console.error("No candidates in Gemini API response:", response.data);
      res.status(500).json({ error: "No resume data received from API" });
    }
  } catch (error) {
    console.error("Error fetching resume:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: "Error generating resume", details: error.message });
  }
});

module.exports = router;
