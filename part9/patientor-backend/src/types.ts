import { z } from "zod";
import { NewPatientSchema } from "./utils";

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

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnoses["code"]>;
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export type Entry = HealthCheckEntry | OccupationalHealthcareEntry | HospitalEntry;

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export enum Gender {
  Female = "female",
  Male = "male",
  Other = "other",
}

export type NewPatient = z.infer<typeof NewPatientSchema>;
export type NonSensitivePatientDetails = Omit<Patients, "ssn" | "entries">;