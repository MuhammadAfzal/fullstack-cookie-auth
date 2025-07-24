import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Forward all auth requests to Auth Service
router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    // Remove the /api/auth prefix when forwarding to Auth Service
    const path = req.path.replace(/^\/api\/auth/, "");
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
  } catch (error: any) {
    next(error);
  }
});

export { router as authRoutes };
