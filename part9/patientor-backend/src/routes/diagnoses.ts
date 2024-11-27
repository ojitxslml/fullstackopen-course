import express from "express";
import { Response } from "express";

import diagnosesService from "../services/diagnosesService";
import { Diagnoses } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Diagnoses[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.post("/", (_req, res) => {
  res.send("Saving a diagnose!");
});

export default router;
