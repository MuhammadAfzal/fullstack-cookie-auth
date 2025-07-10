function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (token === "secure-session-token") {
    req.user = { username: "test" }; // Attach user info to req
    next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
}

module.exports = authMiddleware;
