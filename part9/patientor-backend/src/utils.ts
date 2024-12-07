import { Diagnoses, Gender, NewPatient } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(z.any()),
});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

const HealthCheckEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  healthCheckRating: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]), // Usar z.literal para valores numéricos
  diagnosisCodes: z.array(z.string()).optional(),
});


const OccupationalHealthcareEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HospitalEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const EntrySchema = z.union([
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);



export const parseDiagnosisCodes = (object: unknown): Array<Diagnoses['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnoses['code']>;
  }

  return object.diagnosisCodes as Array<Diagnoses['code']>;
};
