import express from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { NewEntrySchema, NewPatientSchema } from '../utils';

const router = express.Router();


// Return patients without ssn
router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

// Return full patient by id (including entries)
router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);
  if (!patient) return res.status(404).send('Patient not found');
  return res.json(patient);
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof z.ZodError) {
      errorMessage = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    } else if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const parsed = NewEntrySchema.parse(req.body);
    const created = patientsService.addEntry(req.params.id, parsed);
    if (!created) return res.status(404).send('Patient not found');
    return res.json(created);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof z.ZodError) {
      errorMessage = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    } else if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;