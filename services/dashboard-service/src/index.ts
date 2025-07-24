import express from "express";
import {
  securityMiddleware,
  commonMiddleware,
  notFoundHandler,
  errorHandler,
} from "@shared/common";
import dashboardRoutes from "./routes/dashboardRoutes";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, `../.env`) });

const app = express();
const PORT = process.env.PORT || 5003;

app.use(...securityMiddleware);
app.use(...commonMiddleware);
app.use(express.json());

// Dashboard routes
app.use("/dashboard", dashboardRoutes);

// Not found handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Dashboard Service running at http://localhost:${PORT}`);
});
