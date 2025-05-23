
import type { TriagedPatient } from '@/types/triage';

let triagedPatients: TriagedPatient[] = [];

export const addTriagedPatient = (patient: TriagedPatient) => {
  // Add to the beginning of the array so newest entries appear first
  triagedPatients = [patient, ...triagedPatients];
};

export const getTriagedPatients = (): TriagedPatient[] => {
  return [...triagedPatients]; // Return a copy to prevent direct modification
};

export const clearTriagedPatients = () => {
  triagedPatients = [];
};
