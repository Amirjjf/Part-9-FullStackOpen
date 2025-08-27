import { Box, Typography, Stack, Paper } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import { Diagnosis, Entry, HospitalEntry, OccupationalHealthcareEntry } from '../types';

type Props = {
  entry: Entry;
  diagnoses: Diagnosis[];
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const DiagnosisList = ({ codes, diagnoses }: { codes?: string[]; diagnoses: Diagnosis[] }) => {
  if (!codes || codes.length === 0) return null;
  const getName = (code: string) => diagnoses.find(d => d.code === code)?.name;
  return (
    <Box component="ul" sx={{ pl: 3, my: 0 }}>
      {codes.map(code => (
        <li key={code}>
          <Typography variant="body2">{code} {getName(code) ? `- ${getName(code)}` : ''}</Typography>
        </li>
      ))}
    </Box>
  );
};

const HospitalDetails = ({ entry }: { entry: HospitalEntry }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2">Discharge: {entry.discharge.date} – {entry.discharge.criteria}</Typography>
  </Stack>
);

const OccupationalDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2">Employer: {entry.employerName}</Typography>
    {entry.sickLeave && (
      <Typography variant="body2">Sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}</Typography>
    )}
  </Stack>
);

const EntryDetails = ({ entry, diagnoses }: Props) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          {entry.type === 'Hospital' && <LocalHospitalIcon color="error" fontSize="small" />}
          {entry.type === 'OccupationalHealthcare' && <WorkIcon color="action" fontSize="small" />}
          <Typography variant="subtitle2">{entry.date} – {entry.description}</Typography>
        </Stack>

        <DiagnosisList codes={entry.diagnoseCodes} diagnoses={diagnoses} />

        {(() => {
          switch (entry.type) {
            case 'Hospital':
              return <HospitalDetails entry={entry} />;
            case 'OccupationalHealthcare':
              return <OccupationalDetails entry={entry} />;
            default:
              return assertNever(entry);
          }
        })()}
      </Stack>
    </Paper>
  );
};

export default EntryDetails;
