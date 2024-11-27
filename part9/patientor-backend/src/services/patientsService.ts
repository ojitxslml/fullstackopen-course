import patients from "../../data/patients";
import { NonSensitivePatientsDetails, Patients } from "../types";

const getPatients = (): Patients[] => {
  return patients;
};

const addPatient = () => {
  return null;
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
