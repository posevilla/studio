
export interface SelectOption<T = number | string> {
  value: T;
  label: string;
  description: string;
  color?: string; // For FEP levels
  detailedDescription?: string | React.ReactNode; // For more complex descriptions
}

// Specific type for oxygen need levels to include litersPer24h
export interface OxygenNeedLevelOption extends SelectOption<CceeScore> {
  litersPer24h: number;
}

export type FepLevel = 1 | 2 | 3 | 4 | 5;
export type CceeScore = 1 | 2 | 3 | 4 | 5;

export type UnitType = 
  | 'hospitalization' 
  | 'psychiatric' 
  | 'penitentiary' 
  | 'icu' 
  | 'isolation';

export interface CceeFormState {
  fep: FepLevel | undefined;
  oxygenNeed: CceeScore | undefined;
  vitalSignsControl: CceeScore | undefined;
  medicationAndNutrition: CceeScore | undefined;
  unitType: UnitType | undefined;
  unitSpecificScale: CceeScore | undefined;
}

export interface PatientData {
  id: string; // Example: Patient MRN or temporary ID
  fepScore?: FepLevel;
  cceeData?: Partial<CceeFormState>;
  cceeTotalScore?: number;
  aiPatientNotes?: string;
  aiLabResults?: string;
  aiReasoning?: string;
}

export interface ResourceRecommendation {
  type: string;
  crew: string;
  scoreRange: string;
}
