export interface Diagnoses {
  code: string;
  name: string;
  latin?: string;
}

export interface Patients {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string;
  gender: string;
  occupation: string;
}

export enum Gender {
  Female = "female",
  Male = "male",
  Other = "other",
}

export type NonSensitivePatientsDetails = Omit<Patients, "ssn">;
export type NewPatient = Omit<Patients, "id">;
