const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

// Fake login credentials
const USER = { username: "test", password: "1234" };

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend (on port 5173) to send credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    // Set secure cookie
    res.cookie("token", "secure-session-token", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax",
    });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Protected route
app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (token === "secure-session-token") {
    res.json({ username: USER.username });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
