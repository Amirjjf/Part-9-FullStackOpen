import { z } from 'zod';
import { Gender } from './types';

export const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssn: z.string().min(1, 'SSN is required'),
  gender: z.nativeEnum(Gender, {
    message: 'Gender must be male, female, or other'
  }),
  occupation: z.string().min(1, 'Occupation is required')
});

const BaseEntrySchema = z.object({
  date: z.string().min(1, 'date is required'),
  specialist: z.string().min(1, 'specialist is required'),
  description: z.string().min(1, 'description is required'),
  diagnoseCodes: z.array(z.string()).optional()
});

const DischargeSchema = z.object({
  date: z.string().min(1, 'discharge.date is required'),
  criteria: z.string().min(1, 'discharge.criteria is required')
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema
});

const SickLeaveSchema = z.object({
  startDate: z.string().min(1, 'sickLeave.startDate is required'),
  endDate: z.string().min(1, 'sickLeave.endDate is required')
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1, 'employerName is required'),
  sickLeave: SickLeaveSchema.optional()
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);
