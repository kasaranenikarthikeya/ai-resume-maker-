// require("dotenv").config(); // Load environment variables

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const app = express();
// const PORT = process.env.PORT || 3001; // Use environment variable

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Use API key from .env
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// app.post("/generate-resume", async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         if (!prompt) {
//             return res.status(400).json({ error: "Prompt is required" });
//         }

//         const response = await axios.post(GEMINI_API_URL, {
//             contents: [{ parts: [{ text: prompt }] }],
//         });

//         const resumeText = response.data.candidates[0]?.content?.parts[0]?.text || "No resume generated.";
//         res.json({ resume: resumeText });

//     } catch (error) {
//         console.error("Error generating resume:", error);
//         res.status(500).json({ error: "Failed to generate resume" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });



const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Default route to avoid "Cannot GET /" error
app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// Example API route (modify as needed)
app.post("/generate-resume", (req, res) => {
    res.json({ message: "Resume generated successfully!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
