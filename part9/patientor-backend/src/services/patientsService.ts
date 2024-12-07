import patients from "../../data/patients";
import {
  Entry,
  NewPatient,
  NonSensitivePatientDetails,
  Patients,
} from "../types";
import { v1 as uuid } from "uuid";
import { EntrySchema, parseDiagnosisCodes } from "../utils";
import { ZodError } from "zod";

const getPatients = (): Patients[] => {
  return patients;
};

const addPatient = (patient: NewPatient): Patients => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: Entry): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    console.log("no existe");
    return undefined;
  }

  const parsedDiagnosisCodes = parseDiagnosisCodes(entry);

  if (parsedDiagnosisCodes.length > 0) {
    entry.diagnosisCodes = parsedDiagnosisCodes;
  }

  try {
    EntrySchema.parse(entry);
  } catch (e) {
    if (e instanceof ZodError) {
      throw e;
    } else {
      throw new Error("Error inesperado: "+e);
    }
    return undefined;
  }

  const newEntry = {
    ...entry,
    id: uuid(),
  };

  patient.entries = patient.entries || [];
  patient.entries.push(newEntry);

  return newEntry;
};

const getNonSensitiveDetails = (): NonSensitivePatientDetails[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientById = (id: string): Patients | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    patient.entries = patient.entries ?? [];
  }
  return patient;
};

export default {
  getPatients,
  addPatient,
  getNonSensitiveDetails,
  getPatientById,
  addEntry,
};
