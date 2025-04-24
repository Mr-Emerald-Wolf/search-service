import express from "express";
import cors from "cors";
import candidateRoutes from "./routes/candidate.routes";
import jobRoutes from "./routes/job.routes";
import queueRoutes from "./routes/queue.routes";

import { errorHandler } from "./middleware/error";
import { initElasticsearchClient } from "./client/es.client";
import { initializeDatabase } from "./client/mysql.client";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);

// Connect
initElasticsearchClient();
initializeDatabase();
// Routes
app.use("/candidates", candidateRoutes);
app.use("/jobs", jobRoutes);
app.use("/queue", queueRoutes); 

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
