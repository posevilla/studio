
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { CceeFormState, UnitType, CceeScore, OxygenNeedLevelOption } from '@/types/triage';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CceeCategoryInput } from './ccee-category-input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck, Info, HelpCircle, TrendingUp, Activity, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  getFepLevelInfo,
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
  capturedImage?: string | null;
}

export function CceeForm({
  fepScore,
  formState,
  setFormState,
  onFormComplete,
  totalCceeScore,
  capturedImage,
}: CceeFormProps) {
  
  const [oxygenConsumption, setOxygenConsumption] = useState<{ needs12h: number | null, needs24h: number | null }>({ needs12h: null, needs24h: null });

  useEffect(() => {
    if (formState.oxygenNeed) {
      const selectedOxygenLevel = OXYGEN_NEED_LEVELS.find(level => level.value === formState.oxygenNeed) as OxygenNeedLevelOption | undefined;
      if (selectedOxygenLevel && selectedOxygenLevel.litersPer24h !== undefined) {
        const needs24h = selectedOxygenLevel.litersPer24h;
        const needs12h = needs24h / 2;
        setOxygenConsumption({ needs12h, needs24h });
      } else {
        setOxygenConsumption({ needs12h: null, needs24h: null });
      }
    } else {
      setOxygenConsumption({ needs12h: null, needs24h: null });
    }
  }, [formState.oxygenNeed]);

  const handleCategoryChange = (category: keyof Omit<CceeFormState, 'fep' | 'unitType' | 'unitSpecificScale'>, value: CceeScore) => {
    setFormState((prev) => ({ ...prev, [category]: value }));
  };
  
  const handleUnitSpecificScaleChange = (value: CceeScore) => {
    setFormState((prev) => ({ ...prev, unitSpecificScale: value }));
  };

  const handleUnitTypeChange = (value: UnitType) => {
    setFormState((prev) => ({ ...prev, unitType: value, unitSpecificScale: undefined }));
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

  const selectedFepInfo = getFepLevelInfo(fepScore);

  const subtotalAfterOxygen = useMemo(() => {
    const { oxygenNeed } = formState;
    if (fepScore && oxygenNeed) {
        return fepScore + oxygenNeed;
    }
    return null;
  }, [fepScore, formState.oxygenNeed]);

  const subtotalAfterVitals = useMemo(() => {
    const { oxygenNeed, vitalSignsControl } = formState;
    if (fepScore && oxygenNeed && vitalSignsControl) {
      return fepScore + oxygenNeed + vitalSignsControl;
    }
    return null;
  }, [fepScore, formState.oxygenNeed, formState.vitalSignsControl]);

  const subtotalAfterMedication = useMemo(() => {
    const { oxygenNeed, vitalSignsControl, medicationAndNutrition } = formState;
    if (fepScore && oxygenNeed && vitalSignsControl && medicationAndNutrition) {
      return fepScore + oxygenNeed + vitalSignsControl + medicationAndNutrition;
    }
    return null;
  }, [fepScore, formState.oxygenNeed, formState.vitalSignsControl, formState.medicationAndNutrition]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">2. Triaje Avanzado o Secundario (C.C.E.E.)</CardTitle>
        <CardDescription className="text-center">
          Complete los detalles para calcular la Complejidad de Cuidados de Evacuación y Estancia.
          <div className="flex flex-col items-center my-4 space-y-2">
            <div className="flex items-center justify-center space-x-4">
              {selectedFepInfo && (
                <div
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-md border-2 border-foreground/20 shrink-0",
                    selectedFepInfo.bgColorClassName, 
                    selectedFepInfo.textColorClassName
                  )}
                  aria-label={`Nivel F.E.P. ${fepScore}`}
                >
                  {fepScore}
                </div>
              )}
              {capturedImage && (
                <div className="relative w-20 h-20 rounded-md overflow-hidden shadow-md border border-border">
                  <Image
                    src={capturedImage}
                    alt="Imagen capturada del paciente"
                    fill // Changed from layout="fill"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
                    className="object-cover" // Ensure className is applied
                    data-ai-hint="patient identification" 
                  />
                </div>
              )}
            </div>
             <span className="text-sm text-muted-foreground pt-1">
                {capturedImage ? "F.E.P. Seleccionado e Imagen:" : "F.E.P. Seleccionado:"}
            </span>
          </div>
        </CardDescription>
        <Accordion type="single" collapsible className="w-full mb-2 px-6">
          <AccordionItem value="ccee-table">
            <AccordionTrigger className="text-sm hover:no-underline text-center justify-center">
              Ver Tabla de Puntuación C.C.E.E. de Referencia
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative w-full aspect-[1000/706] max-w-2xl mx-auto bg-muted/30 rounded-md p-2">
                <Image
                  src="/images/ccee-scoring-table.png" 
                  alt="Tabla de puntuación C.C.E.E."
                  width={1000}
                  height={706}
                  className="rounded-md object-contain"
                  data-ai-hint="scoring table"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Esta es una tabla de ejemplo. Reemplácela con su imagen de la tabla C.C.E.E.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        <CceeCategoryInput<CceeScore>
          id="oxygenNeed"
          title="B - Necesidad de Oxígeno"
          options={OXYGEN_NEED_LEVELS}
          selectedValue={formState.oxygenNeed}
          onValueChange={(value) => handleCategoryChange('oxygenNeed', value)}
        />
        {formState.oxygenNeed && (oxygenConsumption.needs12h !== null || oxygenConsumption.needs24h !== null || OXYGEN_NEED_LEVELS.find(o => o.value === formState.oxygenNeed)?.litersPer24h === 0) && (
          <Alert variant="default" className="mt-4">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-semibold">Información Adicional sobre Necesidad de Oxígeno</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Puntuación C.C.E.E. para Oxígeno: <span className="font-medium">{formState.oxygenNeed}</span></li>
                {oxygenConsumption.needs12h !== null && oxygenConsumption.needs12h > 0 && (
                  <li>Previsión para 12 horas: <span className="font-medium">{oxygenConsumption.needs12h.toLocaleString()}</span> litros (aprox.)</li>
                )}
                {oxygenConsumption.needs24h !== null && oxygenConsumption.needs24h > 0 && (
                  <li>Previsión para 24 horas: <span className="font-medium">{oxygenConsumption.needs24h.toLocaleString()}</span> litros (aprox.)</li>
                )}
              </ul>
              { (oxygenConsumption.needs12h === 0 || oxygenConsumption.needs24h === 0) && formState.oxygenNeed && OXYGEN_NEED_LEVELS.find(o => o.value === formState.oxygenNeed)?.litersPer24h === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  No se requiere previsión de litros para el nivel seleccionado.
                </p>
              )}
              { (oxygenConsumption.needs12h !== null && oxygenConsumption.needs12h > 0 || oxygenConsumption.needs24h !== null && oxygenConsumption.needs24h > 0) && (
                <p className="text-xs text-muted-foreground mt-2">
                  Estos cálculos son una estimación basada en el nivel seleccionado.
                </p>
              )}
              <Accordion type="single" collapsible className="w-full mt-3">
                <AccordionItem value="oxygen-reference-image">
                  <AccordionTrigger className="text-xs hover:no-underline py-2">
                    Ver imagen de referencia adicional sobre oxígeno
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative w-full aspect-[600/400] max-w-md mx-auto bg-muted/30 rounded-md p-1">
                      <Image
                        src="/images/oxygen-needs-reference.png" 
                        alt="Imagen de referencia para necesidades de oxígeno"
                        width={600}
                        height={400}
                        className="rounded-md object-contain"
                        data-ai-hint="oxygen chart"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Esta es una imagen de ejemplo. Reemplácela con su imagen de referencia.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AlertDescription>
          </Alert>
        )}

        {subtotalAfterOxygen !== null && selectedFepInfo && formState.oxygenNeed && (
            <Alert variant="default" className="mt-4 bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                <AlertTitle className="font-bold text-purple-700 dark:text-purple-500">Subtotal Parcial (A+B)</AlertTitle>
                <AlertDescription>
                    <ul className="list-none mt-1 space-y-1 text-sm">
                        <li>
                            A. F.E.P.: <span className="font-medium">{fepScore}</span>
                            <span
                                className={cn(
                                    "inline-block w-3 h-3 rounded-full ml-2 border",
                                    selectedFepInfo.bgColorClassName,
                                    selectedFepInfo.textColorClassName === 'text-black' || selectedFepInfo.textColorClassName === 'text-gray-800' ? 'border-black/20' : 'border-white/20' 
                                )}
                                title={`Prioridad F.E.P.: ${selectedFepInfo.label}`}
                            ></span>
                        </li>
                        <li>B. Necesidad de Oxígeno: <span className="font-medium">{formState.oxygenNeed}</span></li>
                        <li className="font-semibold pt-1">Suma (A+B): <span className="text-lg font-bold">{subtotalAfterOxygen}</span></li>
                    </ul>
                </AlertDescription>
            </Alert>
        )}


        <Separator />
        <CceeCategoryInput<CceeScore>
          id="vitalSignsControl"
          title="C - Control de Constantes Vitales"
          options={VITAL_SIGNS_LEVELS}
          selectedValue={formState.vitalSignsControl}
          onValueChange={(value) => handleCategoryChange('vitalSignsControl', value)}
        />
        
        {subtotalAfterVitals !== null && formState.vitalSignsControl && (
          <Alert variant="default" className="mt-4 bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <AlertTitle className="font-bold text-blue-700 dark:text-blue-500">Subtotal Parcial (A+B+C)</AlertTitle>
            <AlertDescription>
              <ul className="list-none mt-1 space-y-1 text-sm">
                <li>A. F.E.P.: <span className="font-medium">{fepScore}</span></li>
                <li>B. Necesidad de Oxígeno: <span className="font-medium">{formState.oxygenNeed}</span></li>
                <li>C. Control Constantes Vitales: <span className="font-medium">{formState.vitalSignsControl}</span></li>
                <li className="font-semibold pt-1">Suma Parcial: <span className="text-lg font-bold">{subtotalAfterVitals}</span></li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Separator />
        <CceeCategoryInput<CceeScore>
          id="medicationAndNutrition"
          title="D - Medicación y Nutrición"
          options={MEDICATION_NUTRITION_LEVELS}
          selectedValue={formState.medicationAndNutrition}
          onValueChange={(value) => handleCategoryChange('medicationAndNutrition', value)}
        />

        {subtotalAfterMedication !== null && formState.medicationAndNutrition && (
          <Alert variant="default" className="mt-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-400">
            <ListChecks className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            <AlertTitle className="font-bold text-cyan-700 dark:text-cyan-500">Subtotal Parcial (A+B+C+D)</AlertTitle>
            <AlertDescription>
              <ul className="list-none mt-1 space-y-1 text-sm">
                <li>A. F.E.P.: <span className="font-medium">{fepScore}</span></li>
                <li>B. Necesidad de Oxígeno: <span className="font-medium">{formState.oxygenNeed}</span></li>
                <li>C. Control Constantes Vitales: <span className="font-medium">{formState.vitalSignsControl}</span></li>
                <li>D. Medicación y Nutrición: <span className="font-medium">{formState.medicationAndNutrition}</span></li>
                <li className="font-semibold pt-1">Suma Parcial: <span className="text-lg font-bold">{subtotalAfterMedication}</span></li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Separator />

        <div className="space-y-3">
          <Label htmlFor="unitTypeSelect" className="text-md font-semibold text-foreground">E - Tipo de Unidad (para Escala Específica)</Label>
          <Select
            value={formState.unitType}
            onValueChange={(value: UnitType | undefined) => { 
              if (value) {
                 handleUnitTypeChange(value);
              }
            }}
          >
            <SelectTrigger id="unitTypeSelect" className="w-full">
              <SelectValue placeholder="Seleccione un tipo de unidad..." />
            </SelectTrigger>
            <SelectContent>
              {UNIT_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {formState.unitType && (
          <>
            <Separator />
            <div className="space-y-3">
                {formState.unitType === 'icu' && (
                  <Accordion type="single" collapsible className="w-full mt-3 mb-3 pl-2">
                    <AccordionItem value="sofa-scale-reference-image">
                      <AccordionTrigger className="text-xs hover:no-underline py-2">
                        Ver Tabla de Escala SOFA de Referencia
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="relative w-full aspect-[700/350] max-w-md mx-auto bg-muted/30 rounded-md p-1">
                          <Image
                            src="/images/escala-sofa.png" 
                            alt="Imagen de referencia para Escala SOFA"
                            width={700} 
                            height={350}
                            className="rounded-md object-contain"
                            data-ai-hint="SOFA scale chart"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          Esta es una imagen de ejemplo. Reemplácela con su imagen de referencia de la Escala SOFA.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                <CceeCategoryInput<CceeScore>
                  id="unitSpecificScale"
                  title={`E - Escala Específica para: ${UNIT_TYPES.find(ut => ut.value === formState.unitType)?.label || ''}`}
                  options={UNIT_SPECIFIC_SCALES[formState.unitType]}
                  selectedValue={formState.unitSpecificScale}
                  onValueChange={handleUnitSpecificScaleChange}
                />
            </div>
          </>
        )}
        
        <Separator />

        {totalCceeScore !== null && (
          <Alert variant="default" className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400">
             <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
            <AlertTitle className="font-bold text-green-700 dark:text-green-500">Puntuación Total C.C.E.E.</AlertTitle>
            <AlertDescription>
              <p className="text-2xl font-bold mb-2">{totalCceeScore}</p>
              <Accordion type="single" collapsible className="w-full text-sm">
                <AccordionItem value="score-breakdown">
                  <AccordionTrigger 
                    className="text-xs hover:no-underline py-1 justify-start text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 [&[data-state=open]>svg]:text-green-600 dark:[&[data-state=open]>svg]:text-green-300"
                  >
                    Ver desglose de puntuación
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-green-700/90 dark:text-green-400/90">
                    <ul className="list-none space-y-1 text-xs">
                      <li>A. F.E.P.: <span className="font-medium">{fepScore}</span></li>
                      {formState.oxygenNeed && <li>B. Necesidad de Oxígeno: <span className="font-medium">{formState.oxygenNeed}</span></li>}
                      {formState.vitalSignsControl && <li>C. Control Constantes Vitales: <span className="font-medium">{formState.vitalSignsControl}</span></li>}
                      {formState.medicationAndNutrition && <li>D. Medicación y Nutrición: <span className="font-medium">{formState.medicationAndNutrition}</span></li>}
                      {formState.unitSpecificScale && <li>E. Escala Específica de Unidad: <span className="font-medium">{formState.unitSpecificScale}</span></li>}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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


    