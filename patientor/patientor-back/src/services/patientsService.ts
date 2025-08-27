import patientsData from "../data/patients";
import type { RawPatient, RawEntry } from "../data/patients";
import {
  Patient,
  Gender,
  NonSensitivePatient,
  NewPatient,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from "../types";
import { v1 as uuid } from "uuid";

const mapEntry = (e: RawEntry): Entry => {
  if (e.type === "Hospital") {
    const mapped: HospitalEntry = {
      id: e.id,
      type: "Hospital",
      date: e.date,
      specialist: e.specialist,
      description: e.description,
      diagnoseCodes: e.diagnoseCodes,
      discharge: e.discharge,
    };
    return mapped;
  }
  if (e.type === "HealthCheck") {
    const mapped: HealthCheckEntry = {
      id: e.id,
      type: "HealthCheck",
      date: e.date,
      specialist: e.specialist,
      description: e.description,
      diagnoseCodes: e.diagnoseCodes,
      healthCheckRating: e.healthCheckRating,
    } as HealthCheckEntry;
    return mapped;
  }
  const mapped: OccupationalHealthcareEntry = {
    id: e.id,
    type: "OccupationalHealthcare",
    date: e.date,
    specialist: e.specialist,
    description: e.description,
    diagnoseCodes: e.diagnoseCodes,
    employerName: e.employerName,
    sickLeave: e.sickLeave,
  };
  return mapped;
};

const patients: Patient[] = patientsData.map((obj: RawPatient) => ({
  id: obj.id,
  name: obj.name,
  dateOfBirth: obj.dateOfBirth,
  ssn: obj.ssn,
  gender: obj.gender as Gender,
  occupation: obj.occupation,
  entries: (obj.entries ?? []).map(mapEntry),
}));

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined =>
  patients.find((p) => p.id === id);

const addEntry = (patientId: string, entry: Omit<Entry, 'id'>): Entry | undefined => {
  const patient = findById(patientId);
  if (!patient) return undefined;
  const newEntry: Entry = { id: uuid(), ...entry } as Entry;
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry,
};
