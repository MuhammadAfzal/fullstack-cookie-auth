import express from "express";
import dotenv from "dotenv";
import path from "path";
import {
  securityMiddleware,
  commonMiddleware,
  errorHandler,
  notFoundHandler,
} from "@shared/common";
import insightsRoutes from "./routes/insights";

dotenv.config({ path: path.resolve(__dirname, `../.env`) });

const app = express();
const PORT = process.env.PORT || 3004;

app.use(...securityMiddleware);
app.use(...commonMiddleware);
app.use(express.json());

app.use("/ai", insightsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`AI Service running at http://localhost:${PORT}`);
});
