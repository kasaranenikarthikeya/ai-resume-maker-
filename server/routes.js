require("dotenv").config(); // Load environment variables

const express = require("express");
const axios = require("axios");

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post("/generate-resume", async (req, res) => {
    const { userPrompt } = req.body;
    if (!userPrompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: userPrompt }] }]
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
            res.json({ resume: response.data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "No resume data received from API" });
        }
    } catch (error) {
        console.error("Error fetching resume:", error.response?.data || error.message);
        res.status(500).json({ error: "Error generating resume" });
    }
});

module.exports = router;
