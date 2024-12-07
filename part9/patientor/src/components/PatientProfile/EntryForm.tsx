import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Diagnosis } from "../../types";
import patients from "../../services/patients";

type HealthCheckRating = 0 | 1 | 2 | 3;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
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

type Entry = HealthCheckEntry | OccupationalHealthcareEntry | HospitalEntry;

interface EntryFormProps {
  patientId: string;
  onEntryAdded: (newEntry: Entry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ patientId, onEntryAdded }) => {
  const [type, setType] = useState<"HealthCheck" | "OccupationalHealthcare" | "Hospital">("HealthCheck");
  const [formData, setFormData] = useState<Partial<Entry>>({
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: [],
  });
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/diagnoses")
      .then((response) => {
        setDiagnosis(response.data);
      })
      .catch((error) => {
        console.error("Error fetching diagnoses:", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeChange = (
    e: SelectChangeEvent<"HealthCheck" | "OccupationalHealthcare" | "Hospital">
  ) => {
    setType(e.target.value as "HealthCheck" | "OccupationalHealthcare" | "Hospital");
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    setFormData((prevData) => ({
      ...prevData,
      diagnosisCodes: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (!formData.date) errors.push("Date is required.");
    if (!formData.specialist) errors.push("Specialist name is required.");
    if (!formData.description) errors.push("Description is required.");

    if (type === "HealthCheck") {
      if ((formData as HealthCheckEntry).healthCheckRating === undefined ||
        ![0, 1, 2, 3].includes((formData as HealthCheckEntry).healthCheckRating!)) {
        errors.push("Health Check Rating must be between 0 and 3.");
      }
    }

    if (type === "OccupationalHealthcare") {
      const occupationalData = formData as OccupationalHealthcareEntry;
      if (!occupationalData.employerName) errors.push("Employer name is required.");
      if (occupationalData.sickLeave?.startDate && occupationalData.sickLeave?.endDate &&
        new Date(occupationalData.sickLeave.startDate) > new Date(occupationalData.sickLeave.endDate)) {
        errors.push("Sick leave start date cannot be after end date.");
      }
    }

    if (type === "Hospital") {
      const hospitalData = formData as HospitalEntry;
      if (!hospitalData.discharge?.date) errors.push("Discharge date is required.");
      if (!hospitalData.discharge?.criteria) errors.push("Discharge criteria is required.");
      if (hospitalData.discharge?.date && isNaN(Date.parse(hospitalData.discharge.date))) {
        errors.push("Discharge date must be in a valid format.");
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      setTimeout(() => {
        setFormErrors([]);
      }, 5000);
      return;
    }

    try {
      setFormErrors([]);
      const savedEntry = await patients.addEntry(patientId, {
        ...formData,
        type,
      } as Entry);

      onEntryAdded(savedEntry);
      setSuccessMessage("Entry created successfully.");
      setFormData({
        date: "",
        specialist: "",
        description: "",
        diagnosisCodes: [],
      });
      setType("HealthCheck");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Error saving entry:", error);
      setFormErrors(["An error occurred while saving the entry."]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {formErrors.length > 0 && (
            <Alert severity="error">
              <AlertTitle>Errors found</AlertTitle>
              {formErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {successMessage}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Entry Type</InputLabel>
            <Select value={type} onChange={handleTypeChange} label="Entry Type">
              <MenuItem value="HealthCheck">HealthCheck</MenuItem>
              <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
              <MenuItem value="Hospital">Hospital</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Diagnosis Codes</InputLabel>
            <Select
              multiple
              value={formData.diagnosisCodes || []}
              onChange={handleDiagnosisChange}
              renderValue={(selected) => selected.join(", ")}
              label="Diagnosis Codes"
            >
              {diagnosis.map((diag: Diagnosis) => (
                <MenuItem key={diag.code} value={diag.code}>
                  <Checkbox
                    checked={formData.diagnosisCodes?.includes(diag.code) || false}
                  />
                  <ListItemText primary={diag.code + " - " + diag.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Specialist"
            type="text"
            name="specialist"
            value={formData.specialist || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            type="text"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </Grid>

        {type === "HealthCheck" && (
  <Grid item xs={12}>
    <FormControl fullWidth>
      <InputLabel>Health Check Rating</InputLabel>
      <Select
        value={String((formData as HealthCheckEntry).healthCheckRating) || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            healthCheckRating: Number(e.target.value) as HealthCheckRating,
          })
        }
        label="Health Check Rating"
      >
        <MenuItem value="0">0 - Healthy</MenuItem>
        <MenuItem value="1">1 - Low risk</MenuItem>
        <MenuItem value="2">2 - High risk</MenuItem>
        <MenuItem value="3">3 - Critical risk</MenuItem>
      </Select>
    </FormControl>
  </Grid>
)}

        {type === "OccupationalHealthcare" && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer Name"
                type="text"
                name="employerName"
                value={(formData as OccupationalHealthcareEntry).employerName || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sick Leave Start Date"
                type="date"
                name="sickLeaveStartDate"
                value={(formData as OccupationalHealthcareEntry).sickLeave?.startDate || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sick Leave End Date"
                type="date"
                name="sickLeaveEndDate"
                value={(formData as OccupationalHealthcareEntry).sickLeave?.endDate || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </>
        )}

        {type === "Hospital" && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discharge Date"
                type="date"
                name="dischargeDate"
                value={(formData as HospitalEntry).discharge?.date || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discharge Criteria"
                type="text"
                name="dischargeCriteria"
                value={(formData as HospitalEntry).discharge?.criteria || ""}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntryForm;
