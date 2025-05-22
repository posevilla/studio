
'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { CceeFormState, UnitType, CceeScore } from '@/types/triage';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CceeCategoryInput } from './ccee-category-input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  FEP_LEVELS,
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
  onFormComplete: () => void;
  totalCceeScore: number | null;
}

export function CceeForm({
  fepScore,
  formState,
  setFormState,
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

  const selectedFepInfo = FEP_LEVELS.find(level => level.value === fepScore);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">2. Triaje Avanzado o Secundario (C.C.E.E.)</CardTitle>
        <CardDescription className="text-center">
          Complete los detalles para calcular la Complejidad de Cuidados de Evacuación y Estancia.
          <div className="flex flex-col items-center my-4">
            <span className="text-sm text-muted-foreground mb-1">F.E.P. Seleccionado:</span>
            {selectedFepInfo && (
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-md border-2 border-foreground/20",
                  selectedFepInfo.color, 
                  selectedFepInfo.textColorClassName
                )}
              >
                {fepScore}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <CceeCategoryInput
          id="oxygenNeed"
          title="B - Necesidad de Oxígeno"
          options={OXYGEN_NEED_LEVELS}
          selectedValue={formState.oxygenNeed}
          onValueChange={(value) => handleCategoryChange('oxygenNeed', value)}
        />
        <Separator />
        <CceeCategoryInput
          id="vitalSignsControl"
          title="C - Control de Constantes Vitales"
          options={VITAL_SIGNS_LEVELS}
          selectedValue={formState.vitalSignsControl}
          onValueChange={(value) => handleCategoryChange('vitalSignsControl', value)}
        />
        <Separator />
        <CceeCategoryInput
          id="medicationAndNutrition"
          title="D - Medicación y Nutrición"
          options={MEDICATION_NUTRITION_LEVELS}
          selectedValue={formState.medicationAndNutrition}
          onValueChange={(value) => handleCategoryChange('medicationAndNutrition', value)}
        />
        <Separator />

        {/* Unit Type Selection */}
        <CceeCategoryInput
          id="unitType"
          title="E - Tipo de Unidad (para Escala Específica)"
          options={UNIT_TYPES}
          selectedValue={formState.unitType as CceeScore | undefined} 
          onValueChange={(value) => handleUnitTypeChange(value as unknown as UnitType)} 
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
