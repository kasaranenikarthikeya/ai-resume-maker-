const express = require("express");
const axios = require("axios");

const router = express.Router();

// Hardcoded Mistral API key (NOT RECOMMENDED)
const MISTRAL_API_KEY = "ayWiCpoq4VLZyQkO85KLpaQJiGaIsX2D"; // Replace with your actual Mistral API key
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

router.post("/generate-resume", async (req, res) => {
  const { userPrompt } = req.body;
  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-small",
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      res.json({ resume: response.data.choices[0].message.content });
    } else {
      console.error("No choices in Mistral API response:", response.data);
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
