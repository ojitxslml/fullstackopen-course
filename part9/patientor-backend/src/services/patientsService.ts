import patients from "../../data/patients";
import { NewPatient, NonSensitivePatientsDetails, Patients } from "../types";
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

const getNonSensitiveDetails = (): NonSensitivePatientsDetails[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getPatients,
  addPatient,
  getNonSensitiveDetails,
};
