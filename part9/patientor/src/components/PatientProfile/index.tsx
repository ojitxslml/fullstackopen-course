import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Patient, Gender, Entry, Diagnosis } from "../../types";
import { MedicalInformation, MedicalServices, Work } from "@mui/icons-material";
import EntryForm from "./EntryForm";

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [patientResponse, diagnosesResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/patients/${id}`),
          axios.get("http://localhost:3001/api/diagnoses"),
        ]);
        setPatient(patientResponse.data);
        setDiagnoses(
          diagnosesResponse.data.reduce(
            (acc: Record<string, Diagnosis>, diagnosis: Diagnosis) => {
              acc[diagnosis.code] = diagnosis;
              return acc;
            },
            {}
          )
        );
        setLoading(false);
      } catch (err) {
        setError("Error fetching patient or diagnosis data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const handleEntryAdded = (newEntry: Entry) => {
    setPatient((prevPatient) => {
      if (prevPatient) {
        return {
          ...prevPatient,
          entries: [...(prevPatient.entries ?? []), newEntry],
        };
      }
      return prevPatient;
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  const renderGenderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Female:
        return <FemaleIcon />;
      default:
        return null;
    }
  };

  const assertNever = (value: never): never => {
    throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    const translateDiagnosisCodes = (codes?: string[]) => {
      if (!codes || codes.length === 0) return null;

      return (
        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle2">Diagnoses:</Typography>
          <ul>
            {codes.map((code) => (
              <li key={code}>
                {code}: {diagnoses[code]?.name || "Unknown"}
                {diagnoses[code]?.latin && ` (${diagnoses[code].latin})`}
              </li>
            ))}
          </ul>
        </Box>
      );
    };

    switch (entry.type) {
      case "HealthCheck":
        return (
          <Box key={entry.id} sx={{ my: 2, p: 2, border: "1px solid #ccc" }}>
            <Typography variant="subtitle1">
              Health Check <Work />
            </Typography>
            <Typography>Description: {entry.description}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Health Rating: {entry.healthCheckRating}</Typography>
            {translateDiagnosisCodes(entry.diagnosisCodes)}
          </Box>
        );

      case "Hospital":
        return (
          <Box key={entry.id} sx={{ my: 2, p: 2, border: "1px solid #ccc" }}>
            <Typography variant="subtitle1">
              Hospital Visit <MedicalInformation />
            </Typography>
            <Typography>Description: {entry.description}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
            {entry.discharge && (
              <Typography>
                Discharge: {entry.discharge.date} - {entry.discharge.criteria}
              </Typography>
            )}
            {translateDiagnosisCodes(entry.diagnosisCodes)}
          </Box>
        );

      case "OccupationalHealthcare":
        return (
          <Box key={entry.id} sx={{ my: 2, p: 2, border: "1px solid #ccc" }}>
            <Typography variant="subtitle1">
              Occupational Healthcare <MedicalServices />
            </Typography>
            <Typography>Description: {entry.description}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
            <Typography>Employer: {entry.employerName}</Typography>
            {entry.sickLeave && (
              <Typography>
                Sick Leave: {entry.sickLeave.startDate} -{" "}
                {entry.sickLeave.endDate}
              </Typography>
            )}
            {translateDiagnosisCodes(entry.diagnosisCodes)}
          </Box>
        );

      default:
        return assertNever(entry);
    }
  };

  const renderEntries = (entries: Entry[]) => {
    return entries.map((entry) => (
      <EntryDetails key={entry.id} entry={entry} />
    ));
  };

  return (
    <Container>
      {patient ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" sx={{ my: 2 }}>
            {patient.name}
            {renderGenderIcon(patient.gender)}
          </Typography>
          <Typography>SSN: {patient.ssn}</Typography>
          <Typography>Occupation: {patient.occupation}</Typography>
          <br />
          <br />
          <EntryForm patientId={patient.id} onEntryAdded={handleEntryAdded} />
          <br />
          <br />
          {patient.entries && patient.entries.length > 0 ? (
            <Box>
              <Typography variant="h5" sx={{ my: 2 }}>
                Entries
              </Typography>
              {renderEntries(patient.entries)}
            </Box>
          ) : (
            <Typography>No entries found.</Typography>
          )}
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          Patient not found
        </Typography>
      )}
    </Container>
  );
};

export default PatientProfile;
