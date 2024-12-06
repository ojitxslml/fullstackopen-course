import express, { RequestHandler } from "express";
import cors from "cors";

import diagnosesRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";

const app = express();
const router = express.Router(); // Crea un router

const PORT = 3001;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors() as RequestHandler);
app.use(express.json());

router.get("/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
