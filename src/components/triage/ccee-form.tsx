'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { CceeFormState, UnitType, CceeScore } from '@/types/triage';
import type { ExtractPatientDataOutput } from '@/ai/flows/extract-patient-data';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AiAssistCard } from './ai-assist-card';
import { CceeCategoryInput } from './ccee-category-input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ShieldCheck } from 'lucide-react';

import {
  OXYGEN_NEED_LEVELS,
  VITAL_SIGNS_LEVELS,
  MEDICATION_NUTRITION_LEVELS,
  UNIT_TYPES,
  UNIT_SPECIFIC_SCALES,
} from '@/constants/triage-data';

interface CceeFormProps {
  fepScore: CceeScore;
  formState: CceeFormState;
  setFormState: Dispatch<SetStateAction<CceeFormState>>;
  aiPatientNotes: string;
  setAiPatientNotes: Dispatch<SetStateAction<string>>;
  aiLabResults: string;
  setAiLabResults: Dispatch<SetStateAction<string>>;
  aiExtractedData: ExtractPatientDataOutput | null;
  onExtractDataWithAI: () => Promise<void>;
  isProcessingAI: boolean;
  onFormComplete: () => void;
  totalCceeScore: number | null;
}

export function CceeForm({
  fepScore,
  formState,
  setFormState,
  aiPatientNotes,
  setAiPatientNotes,
  aiLabResults,
  setAiLabResults,
  aiExtractedData,
  onExtractDataWithAI,
  isProcessingAI,
  onFormComplete,
  totalCceeScore,
}: CceeFormProps) {
  
  const handleCategoryChange = (category: keyof Omit<CceeFormState, 'fep' | 'unitType'>, value: CceeScore) => {
    setFormState((prev) => ({ ...prev, [category]: value }));
  };

  const handleUnitTypeChange = (value: UnitType) => {
    setFormState((prev) => ({ ...prev, unitType: value, unitSpecificScale: undefined })); // Reset unitSpecificScale when unitType changes
  };

  const isFormValid = () => {
    return (
      formState.oxygenNeed !== undefined &&
      formState.vitalSignsControl !== undefined &&
      formState.medicationAndNutrition !== undefined &&
      formState.unitType !== undefined &&
      formState.unitSpecificScale !== undefined
    );
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">2. Triaje Avanzado (C.C.E.E.)</CardTitle>
        <CardDescription>
          Complete los detalles para calcular la Complejidad de Cuidados de Evacuación y Estancia.
          El valor F.E.P. seleccionado es: <span className="font-bold text-primary">{fepScore}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AiAssistCard
          patientNotes={aiPatientNotes}
          setPatientNotes={setAiPatientNotes}
          labResults={aiLabResults}
          setLabResults={setAiLabResults}
          onExtractData={onExtractDataWithAI}
          isProcessing={isProcessingAI}
        />

        {aiExtractedData?.reasoning && (
          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Información del Asistente IA</AlertTitle>
            <AlertDescription className="text-sm text-foreground/80">
              <span className="font-semibold">Resumen del razonamiento de la IA:</span> {aiExtractedData.reasoning}
              <br/> <strong className="mt-1 block">Por favor, revise y confirme cada campo.</strong>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        <CceeCategoryInput
          id="oxygenNeed"
          title="B - Necesidad de Oxígeno"
          options={OXYGEN_NEED_LEVELS}
          selectedValue={formState.oxygenNeed}
          onValueChange={(value) => handleCategoryChange('oxygenNeed', value)}
          aiSuggestion={aiExtractedData?.oxygenNeed as CceeScore | undefined}
          aiReasoning={aiExtractedData?.reasoning}
        />
        <Separator />
        <CceeCategoryInput
          id="vitalSignsControl"
          title="C - Control de Constantes Vitales"
          options={VITAL_SIGNS_LEVELS}
          selectedValue={formState.vitalSignsControl}
          onValueChange={(value) => handleCategoryChange('vitalSignsControl', value)}
          aiSuggestion={aiExtractedData?.vitalSignsControl as CceeScore | undefined}
          aiReasoning={aiExtractedData?.reasoning}
        />
        <Separator />
        <CceeCategoryInput
          id="medicationAndNutrition"
          title="D - Medicación y Nutrición"
          options={MEDICATION_NUTRITION_LEVELS}
          selectedValue={formState.medicationAndNutrition}
          onValueChange={(value) => handleCategoryChange('medicationAndNutrition', value)}
          aiSuggestion={aiExtractedData?.medicationAndNutrition as CceeScore | undefined}
          aiReasoning={aiExtractedData?.reasoning}
        />
        <Separator />

        {/* Unit Type Selection */}
        <CceeCategoryInput
          id="unitType"
          title="E - Tipo de Unidad (para Escala Específica)"
          options={UNIT_TYPES}
          selectedValue={formState.unitType as CceeScore | undefined} // Cast for RadioGroup, ensure value is stringified if not number
          onValueChange={(value) => handleUnitTypeChange(value as unknown as UnitType)} // Value from RadioGroup is string
        />
        
        {formState.unitType && (
          <>
            <Separator />
            <CceeCategoryInput
              id="unitSpecificScale"
              title={`E - Escala Específica para: ${UNIT_TYPES.find(ut => ut.value === formState.unitType)?.label || ''}`}
              options={UNIT_SPECIFIC_SCALES[formState.unitType]}
              selectedValue={formState.unitSpecificScale}
              onValueChange={(value) => handleCategoryChange('unitSpecificScale', value)}
              aiSuggestion={aiExtractedData?.unitSpecificScale as CceeScore | undefined}
              aiReasoning={aiExtractedData?.reasoning}
            />
          </>
        )}
        
        <Separator />

        {totalCceeScore !== null && (
          <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400">
             <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
            <AlertTitle className="font-bold text-green-700 dark:text-green-500">Puntuación Total C.C.E.E.</AlertTitle>
            <AlertDescription className="text-2xl font-bold">
              {totalCceeScore}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={onFormComplete} 
          disabled={!isFormValid()} 
          className="w-full sm:w-auto text-base py-3 px-6"
          size="lg"
        >
          Ver Recomendación de Recursos
        </Button>
      </CardContent>
    </Card>
  );
}
