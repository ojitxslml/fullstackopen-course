import patients from "../../data/patients";
import { NewPatient, NonSensitivePatientDetails, Patients } from "../types";
import { v1 as uuid } from "uuid";

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
  getPatientById
};
