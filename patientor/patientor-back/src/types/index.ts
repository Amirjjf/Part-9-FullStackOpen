

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

// Base and specific Entry types
export interface BaseEntry {
    id: string;
    date: string;
    specialist: string;
    description: string;
    // Using the name from exercise example
    diagnoseCodes?: Array<Diagnosis['code']>;
}

export interface Discharge {
    date: string;
    criteria: string;
}

export interface HospitalEntry extends BaseEntry {
    type: 'Hospital';
    discharge: Discharge;
}

export interface SickLeave {
    startDate: string;
    endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: 'OccupationalHealthcare';
    employerName: string;
    sickLeave?: SickLeave;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry;

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export type NewPatient = Omit<Patient, 'id' | 'entries'>;

export type NewEntry = Omit<Entry, 'id'>;
