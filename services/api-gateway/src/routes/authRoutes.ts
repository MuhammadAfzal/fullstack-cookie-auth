import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Middleware to strip /api/auth prefix from the path
router.use((req, res, next) => {
  req.url = req.originalUrl.replace(/^\/api\/auth/, "");
  next();
});

// Forward all auth requests to Auth Service
router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    const path = req.url; // Already stripped
    const data = req.body;
    const headers = {
      ...req.headers,
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
    };

    // Remove headers that shouldn't be forwarded
    delete headers.host;
    delete headers["content-length"];

    const response = await proxyService.forwardToAuthService(
      method,
      path,
      data,
      headers
    );

    // Forward cookies from Auth Service response
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }

    // Forward the response
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };
