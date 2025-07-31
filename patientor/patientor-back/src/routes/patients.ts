import express from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { NewPatientSchema } from '../utils';

const router = express.Router();


// Return patients without ssn
router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
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

export default router;