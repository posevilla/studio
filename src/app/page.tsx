'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { FepSelector } from '@/components/triage/fep-selector';
import { CceeForm } from '@/components/triage/ccee-form';
import { ResourceDisplay } from '@/components/triage/resource-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { extractPatientData, type ExtractPatientDataInput, type ExtractPatientDataOutput } from '@/ai/flows/extract-patient-data';
import { useToast } from "@/hooks/use-toast";
import type { PatientData, CceeFormState, CceeScore, UnitType } from '@/types/triage';


const initialCceeFormState: CceeFormState = {
  fep: undefined,
  oxygenNeed: undefined,
  vitalSignsControl: undefined,
  medicationAndNutrition: undefined,
  unitType: undefined,
  unitSpecificScale: undefined,
};

export default function TriagePage() {
  const [patientId, setPatientId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: FEP, 2: CCEE, 3: Resources
  
  const [selectedFep, setSelectedFep] = useState<CceeScore | undefined>(undefined);
  const [cceeFormState, setCceeFormState] = useState<CceeFormState>(initialCceeFormState);
  
  const [aiPatientNotes, setAiPatientNotes] = useState<string>('');
  const [aiLabResults, setAiLabResults] = useState<string>('');
  const [aiExtractedData, setAiExtractedData] = useState<ExtractPatientDataOutput | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  
  const [totalCceeScore, setTotalCceeScore] = useState<number | null>(null);
  
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setPatientId('');
    setSelectedFep(undefined);
    setCceeFormState(initialCceeFormState);
    setAiPatientNotes('');
    setAiLabResults('');
    setAiExtractedData(null);
    setTotalCceeScore(null);
    setCurrentStep(1);
    toast({ title: "Formulario Reiniciado", description: "Puede comenzar un nuevo triaje." });
  }, [toast]);

  useEffect(() => {
    if (selectedFep) {
      setCceeFormState(prev => ({ ...prev, fep: selectedFep }));
      if (currentStep === 1) setCurrentStep(2); // Auto-advance to CCEE if FEP is selected
    }
  }, [selectedFep, currentStep]);

  useEffect(() => {
    // Apply AI extracted data to form if available
    if (aiExtractedData) {
      setCceeFormState(prev => ({
        ...prev,
        fep: (aiExtractedData.fep as CceeScore) ?? prev.fep, // AI might also suggest FEP
        oxygenNeed: (aiExtractedData.oxygenNeed as CceeScore) ?? prev.oxygenNeed,
        vitalSignsControl: (aiExtractedData.vitalSignsControl as CceeScore) ?? prev.vitalSignsControl,
        medicationAndNutrition: (aiExtractedData.medicationAndNutrition as CceeScore) ?? prev.medicationAndNutrition,
        // Unit type must be selected by user. AI might suggest unitSpecificScale.
        // If AI's unitSpecificScale is for a different unit type, user must reconcile.
        // For now, we apply it directly. User must verify.
        unitSpecificScale: (aiExtractedData.unitSpecificScale as CceeScore) ?? prev.unitSpecificScale,
      }));
      // If AI suggested FEP, update selectedFep as well
      if (aiExtractedData.fep) {
        setSelectedFep(aiExtractedData.fep as CceeScore);
      }
    }
  }, [aiExtractedData]);

  const handleExtractDataWithAI = async () => {
    if (!aiPatientNotes && !aiLabResults) {
      toast({
        title: "Entrada Requerida",
        description: "Por favor, ingrese notas del paciente o resultados de laboratorio.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessingAI(true);
    setAiExtractedData(null); 
    try {
      const input: ExtractPatientDataInput = {
        patientNotes: aiPatientNotes,
        labResults: aiLabResults,
      };
      const result = await extractPatientData(input);
      setAiExtractedData(result);
      toast({
        title: "Datos Extraídos por IA",
        description: "Revise los campos pre-rellenados y el razonamiento de la IA.",
      });
    } catch (error) {
      console.error("Error extracting data with AI:", error);
      toast({
        title: "Error de IA",
        description: "No se pudieron extraer los datos. Por favor, inténtelo de nuevo o ingrese manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  };
  
  const calculateTotalCceeScore = useCallback(() => {
    if (
      cceeFormState.fep &&
      cceeFormState.oxygenNeed &&
      cceeFormState.vitalSignsControl &&
      cceeFormState.medicationAndNutrition &&
      cceeFormState.unitType && // unitType must be chosen
      cceeFormState.unitSpecificScale
    ) {
      const score =
        cceeFormState.fep +
        cceeFormState.oxygenNeed +
        cceeFormState.vitalSignsControl +
        cceeFormState.medicationAndNutrition +
        cceeFormState.unitSpecificScale;
      setTotalCceeScore(score);
      return score;
    }
    setTotalCceeScore(null);
    return null;
  }, [cceeFormState]);

  useEffect(() => {
    calculateTotalCceeScore();
  }, [cceeFormState, calculateTotalCceeScore]);

  const handleCceeFormComplete = () => {
    const score = calculateTotalCceeScore();
    if (score !== null) {
      setCurrentStep(3);
       toast({
        title: "C.C.E.E. Calculado",
        description: `Puntuación total: ${score}. Mostrando recomendación de recursos.`,
      });
    } else {
       toast({
        title: "Formulario Incompleto",
        description: "Por favor, complete todos los campos del C.C.E.E.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Identificación del Paciente (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="patientId">ID del Paciente / N° de Cama</Label>
              <Input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Ej: 12345 / Cama 10A"
                className="mt-1"
              />
            </CardContent>
          </Card>

          <FepSelector selectedFep={selectedFep} onFepSelect={setSelectedFep} />

          {currentStep >= 2 && selectedFep && (
            <CceeForm
              fepScore={selectedFep}
              formState={cceeFormState}
              setFormState={setCceeFormState}
              aiPatientNotes={aiPatientNotes}
              setAiPatientNotes={setAiPatientNotes}
              aiLabResults={aiLabResults}
              setAiLabResults={setAiLabResults}
              aiExtractedData={aiExtractedData}
              onExtractDataWithAI={handleExtractDataWithAI}
              isProcessingAI={isProcessingAI}
              onFormComplete={handleCceeFormComplete}
              totalCceeScore={totalCceeScore}
            />
          )}

          {currentStep === 3 && totalCceeScore !== null && (
            <ResourceDisplay cceeScore={totalCceeScore} />
          )}
          
          <Separator className="my-8" />

          <div className="flex justify-center">
            <Button variant="outline" onClick={resetForm} className="text-lg py-3 px-6">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reiniciar / Nuevo Paciente
            </Button>
          </div>

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        SITECS Triage Assist &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
