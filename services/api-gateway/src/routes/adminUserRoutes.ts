import { Router } from "express";
import { proxyService } from "../services/proxyService";

const router = Router();

router.all("*", async (req, res, next) => {
  try {
    const method = req.method;
    // Forward /api/admin/users to /api/users/admin/users
    const path = req.originalUrl.replace(/^\/api\/admin/, "/api/users/admin");
    const data = req.body;

    console.log("yes coming in admin user routes", path);
    console.log("[API Gateway] Proxying to user service:", path);

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

    const response = await proxyService.forwardToUserService(
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
