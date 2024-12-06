import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Patient, Gender } from "../../types";

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/patients/${id}`
        );
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching patient data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

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
