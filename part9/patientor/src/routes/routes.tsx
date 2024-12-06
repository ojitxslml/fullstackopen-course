import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientListPage from "../components/PatientListPage";
import PatientProfile from "../components/PatientProfile";
import { Patient } from "../types";

interface AppRoutesProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ patients, setPatients }) => (
  <Routes>
    <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
    <Route path="/profile/:id" element={<PatientProfile />} />
  </Routes>
);

export default AppRoutes;
