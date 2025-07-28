import express from 'express';
import patientsService from '../services/patientsService';

const router = express.Router();


// Return patients without ssn
router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

export default router;