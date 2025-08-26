import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Middleware to strip /api prefix from the path
router.use((req, res, next) => {
  req.url = req.originalUrl.replace(/^\/api/, "");
  next();
});

// Forward all dashboard requests to Dashboard Service
router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    const path = req.url; // Already stripped
    const data = req.body;
    console.log("API Gateway forwarding to dashboard service path:", path);

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
      authorization: token ? `Bearer ${token}` : req.headers.authorization,
    };
    delete headers.host;
    delete headers["content-length"];

    const response = await proxyService.forwardToDashboardService(
      method,
      path,
      data,
      headers
    );

    res.status(response.status).set(response.headers).send(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;
