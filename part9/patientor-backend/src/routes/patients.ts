import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import patientsService from "../services/patientsService";
import { Entry, NewPatient, Patients } from "../types";
import { NewPatientSchema } from "../utils";

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get("/", (_req, res: Response<Patients[]>) => {
  res.send(patientsService.getNonSensitiveDetails());
});

router.get("/:id", (req: Request, res: Response<Patients>) => {
  const patient = patientsService.getPatientById(req.params.id);
  res.send(patient);
});

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patients>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.post(
  "/:id/entries",
  (req: Request<{ id: string }, unknown, Entry>, res: Response<Entry>) => {
    const addedEntry = patientsService.addEntry(req.params.id, req.body);
    res.json(addedEntry);
  }
);

router.use(errorMiddleware);

export default router;
