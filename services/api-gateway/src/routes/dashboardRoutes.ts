import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Forward all dashboard requests to User Service
router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    // Forward the full path as-is, but strip /api prefix
    const path = req.originalUrl.replace(/^\/api/, "");
    const data = req.body;
    console.log("yes coming here at api gateway path", path);

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
