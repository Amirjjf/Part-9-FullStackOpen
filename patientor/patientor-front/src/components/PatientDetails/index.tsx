import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, CircularProgress, Typography, Link, Stack, Paper } from "@mui/material";
import patientService from "../../services/patients";
import { Diagnosis, Entry, Patient } from "../../types";
import EntryDetails from "../EntryDetails";

interface Props { diagnoses: Diagnosis[] }

const PatientDetails = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!id) return;
        const data = await patientService.getById(id);
        setPatient(data);
      } catch (e) {
        setError("Failed to load patient");
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!patient) return <Typography>No patient found.</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{patient.name}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      {patient.ssn && <Typography>SSN: {patient.ssn}</Typography>}
      {patient.dateOfBirth && <Typography>DOB: {patient.dateOfBirth}</Typography>}
      <Typography>Occupation: {patient.occupation}</Typography>

      <Box>
        <Typography variant="h6">Entries</Typography>
        {patient.entries && patient.entries.length > 0 ? (
          <Stack spacing={1}>
            {patient.entries.map((e: Entry) => (
              <EntryDetails key={e.id} entry={e} diagnoses={diagnoses} />
            ))}
          </Stack>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography color="text.secondary">No entries yet</Typography>
          </Paper>
        )}
      </Box>

      <Link component={RouterLink} to="/">Back to list</Link>
    </Stack>
  );
};

export default PatientDetails;
