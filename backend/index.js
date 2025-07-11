const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

const USER = { username: "test", password: "1234" };

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.cookie("token", "secure-session-token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Auth check
app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (token === "secure-session-token") {
    res.json({ user: { username: USER.username } });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
