import { z } from "zod";
import { NewPatientSchema } from "./utils";

export interface Entry {}

export interface Diagnoses {
  code: string;
  name: string;
  latin?: string;
}

export interface Patients {
  id: string;
  name: string;
  ssn?: string;
  gender: string;
  occupation: string;
  dateOfBirth: string;
  entries?: Entry[];
}

export enum Gender {
  Female = "female",
  Male = "male",
  Other = "other",
}

export type NewPatient = z.infer<typeof NewPatientSchema>;
export type NonSensitivePatientDetails = Omit<Patients, "ssn" | "entries">;
