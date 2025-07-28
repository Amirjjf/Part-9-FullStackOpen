import patientsData from '../data/patients';
import { Patient, Gender, NonSensitivePatient } from '../types';

const patients: Patient[] = patientsData.map(obj => ({
  ...obj,
  gender: obj.gender as Gender
}));

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

export default {
  getEntries,
  getNonSensitiveEntries
};
