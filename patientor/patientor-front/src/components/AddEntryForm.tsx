import { useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Alert } from '@mui/material';
import { HealthCheckRating, NewEntry } from '../types';

type Props = {
  patientId: string;
  onCreated: (entry: NewEntry) => void;
};

type EntryType = 'Hospital' | 'OccupationalHealthcare' | 'HealthCheck';

const AddEntryForm = ({ patientId, onCreated }: Props) => {
  const [type, setType] = useState<EntryType>('Hospital');
  const [values, setValues] = useState<Record<string, string>>({
    date: '', specialist: '', description: '',
    dischargeDate: '', dischargeCriteria: '',
    employerName: '', sickStart: '', sickEnd: '',
    healthCheckRating: '0',
    diagnoseCodes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues(v => ({ ...v, [k]: e.target.value }));

  const buildPayload = (): NewEntry => {
    const base: Omit<NewEntry, 'type'> & { diagnoseCodes?: string[] } = {
      date: values.date,
      specialist: values.specialist,
      description: values.description,
      diagnoseCodes: values.diagnoseCodes
        ? values.diagnoseCodes.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
    } as unknown as Omit<NewEntry, 'type'>;
    if (type === 'Hospital') {
      return {
        ...base,
        type: 'Hospital',
        discharge: { date: values.dischargeDate, criteria: values.dischargeCriteria }
      };
    }
    if (type === 'OccupationalHealthcare') {
      return {
        ...base,
        type: 'OccupationalHealthcare',
        employerName: values.employerName,
        sickLeave: values.sickStart && values.sickEnd ? { startDate: values.sickStart, endDate: values.sickEnd } : undefined
      };
    }
    return {
      ...base,
      type: 'HealthCheck',
      healthCheckRating: Number(values.healthCheckRating) as HealthCheckRating
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = buildPayload();
      const res = await (await import('../services/patients')).default.addEntry(patientId, payload);
      onCreated(res);
      setValues({ date: '', specialist: '', description: '', dischargeDate: '', dischargeCriteria: '', employerName: '', sickStart: '', sickEnd: '', healthCheckRating: '0', diagnoseCodes: '' });
    } catch (err) {
      const anyErr = err as { response?: { data?: unknown } };
      const msg = anyErr?.response?.data ?? 'Failed to add entry';
      setError(typeof msg === 'string' ? msg : 'Failed to add entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField select label="Type" value={type} onChange={e => setType(e.target.value as EntryType)} size="small">
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
        </TextField>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Date (YYYY-MM-DD)" value={values.date} onChange={update('date')} size="small" fullWidth />
          <TextField label="Specialist" value={values.specialist} onChange={update('specialist')} size="small" fullWidth />
        </Stack>
        <TextField label="Description" value={values.description} onChange={update('description')} size="small" fullWidth />
        <TextField label="Diagnose codes (comma-separated)" value={values.diagnoseCodes} onChange={update('diagnoseCodes')} size="small" fullWidth />

        {type === 'Hospital' && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Discharge date" value={values.dischargeDate} onChange={update('dischargeDate')} size="small" fullWidth />
            <TextField label="Discharge criteria" value={values.dischargeCriteria} onChange={update('dischargeCriteria')} size="small" fullWidth />
          </Stack>
        )}

        {type === 'OccupationalHealthcare' && (
          <>
            <TextField label="Employer name" value={values.employerName} onChange={update('employerName')} size="small" fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Sick leave start" value={values.sickStart} onChange={update('sickStart')} size="small" fullWidth />
              <TextField label="Sick leave end" value={values.sickEnd} onChange={update('sickEnd')} size="small" fullWidth />
            </Stack>
          </>
        )}

        {type === 'HealthCheck' && (
          <TextField label="Health check rating (0-3)" value={values.healthCheckRating} onChange={update('healthCheckRating')} size="small" fullWidth />
        )}

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={submitting}>Add Entry</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddEntryForm;
