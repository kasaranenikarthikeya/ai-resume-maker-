const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "https://ai-resume-client.onrender.com" }));
app.use(express.json());

// Routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("AI Resume Builder Backend");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
