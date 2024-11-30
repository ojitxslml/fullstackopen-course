import express, { NextFunction, Request } from "express";
import { Response } from "express";
import { z } from "zod";
import patientsService from "../services/patientsService";
import { NewPatient, Patients } from "../types";
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

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patients>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.use(errorMiddleware);

export default router;
