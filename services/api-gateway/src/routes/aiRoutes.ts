import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

// Strip /api prefix (keep /ai/...)
router.use((req, res, next) => {
  req.url = req.originalUrl.replace(/^\/api/, "");
  next();
});

router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    const path = req.url;
    const data = req.body;

    const headers = { ...req.headers } as any;
    delete headers.host;
    delete headers["content-length"];

    const response = await proxyService.forwardToAIService(
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
