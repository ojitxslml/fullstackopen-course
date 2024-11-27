import express from "express";
import { Response } from "express";

import patientsService from "../services/patientsService";
import { Patients } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Patients[]>) => {
  res.send(patientsService.getNonSensitiveDetails());
});

router.post("/", (_req, res) => {
  res.send("Saving a patient!");
});

export default router;
