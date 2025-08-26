import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Middleware to strip /api/users prefix from the path
router.use((req, res, next) => {
  req.url = req.originalUrl.replace(/^\/api\/users/, "");
  next();
});

// Forward all user requests to User Service
router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    const path = req.url; // Already stripped
    const data = req.body;

    // Extract token from cookie if present
    let token;
    if (req.headers.cookie) {
      const match = req.headers.cookie.match(/token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    const headers = {
      ...req.headers,
      // Always set Authorization header if token is present
      authorization: token ? `Bearer ${token}` : req.headers.authorization,
      // Remove host/content-length headers
    };
    delete headers.host;
    delete headers["content-length"];

    const response = await proxyService.forwardToUserService(
      method,
      path,
      data,
      headers
    );

    // Forward the response
    res.status(response.status).set(response.headers).send(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;
