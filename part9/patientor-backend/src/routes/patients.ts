import express from "express";
import { Response } from "express";

import patientsService from "../services/patientsService";
import { Patients } from "../types";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<Patients[]>) => {
  res.send(patientsService.getNonSensitiveDetails());
});

router.post("/", (req, res) => {
 try {
  const newPatient = toNewPatient(req.body);
  
  const addedPatient = patientsService.addPatient(newPatient);
  res.json(addedPatient);
 } catch (error) {
  let errorMessage = "Something went wrong :(";
  if (error instanceof Error) {
    errorMessage = "Error: " + error.message;
  }
  res.status(400).send(errorMessage);
 }
});



export default router;
