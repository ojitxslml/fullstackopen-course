import diagnoses from "../../data/diagnoses";
import { Diagnoses } from "../types";

const getDiagnoses = (): Diagnoses[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose,
};
