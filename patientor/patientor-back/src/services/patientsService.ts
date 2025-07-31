import patientsData from "../data/patients";
import { Patient, Gender, NonSensitivePatient } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientsData.map((obj) => ({
  ...obj,
  gender: obj.gender as Gender,
}));

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

const addPatient = (patient: Omit<Patient, "id">): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
