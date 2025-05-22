
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { FepSelector } from '@/components/triage/fep-selector';
import { CceeForm } from '@/components/triage/ccee-form';
import { ResourceDisplay } from '@/components/triage/resource-display';
import { CameraView } from '@/components/triage/camera-view';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertCircle, RotateCcw, Camera } from 'lucide-react';
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
  const [showCamera, setShowCamera] = useState<boolean>(false);
  // const [capturedImageData, setCapturedImageData] = useState<string | null>(null); // State to store captured image data if needed later
  
  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const performFullReset = useCallback(() => {
    setPatientId('');
    setSelectedFep(undefined);
    setCceeFormState(initialCceeFormState);
    setAiPatientNotes('');
    setAiLabResults('');
    setAiExtractedData(null);
    setTotalCceeScore(null);
    setCurrentStep(1);
    setShowCamera(false);
    // setCapturedImageData(null);
    setIsConfirmResetDialogOpen(false); // Close dialog if open
    toast({ title: "Formulario Reiniciado Completamente", description: "Puede comenzar un nuevo triaje." });
  }, [toast]);

  const continueWithAIData = useCallback(() => {
    setPatientId(''); // Clear patient ID for the new patient
    // aiExtractedData, aiPatientNotes, aiLabResults are kept
    // useEffect for aiExtractedData will apply values to cceeFormState.
    // selectedFep is also updated by that useEffect if aiExtractedData.fep exists.

    // Ensure FEP from AI is set for step progression if it exists
    if (aiExtractedData?.fep) {
      setSelectedFep(aiExtractedData.fep as CceeScore);
      setCceeFormState(prev => ({ ...prev, fep: aiExtractedData.fep as CceeScore }));
    } else if (selectedFep) { // If AI didn't provide FEP, but user selected one, keep it for CCEE
      setCceeFormState(prev => ({ ...prev, fep: selectedFep }));
    }
    
    setCurrentStep(2); // Move to CCEE form
    setIsConfirmResetDialogOpen(false); // Close dialog
    toast({
      title: "Continuando con Datos IA",
      description: "Se han mantenido los datos de IA. Ingrese ID del nuevo paciente y proceda con el C.C.E.E.",
    });
  }, [aiExtractedData, toast, selectedFep]);


  const handleResetOrContinue = () => {
    // Check if there's meaningful AI data to offer continuation
    if (aiExtractedData && (aiExtractedData.fep || aiExtractedData.oxygenNeed || aiExtractedData.vitalSignsControl || aiExtractedData.medicationAndNutrition || aiExtractedData.unitSpecificScale)) {
      setIsConfirmResetDialogOpen(true);
    } else {
      performFullReset();
    }
  };

  useEffect(() => {
    if (selectedFep) {
      setCceeFormState(prev => ({ ...prev, fep: selectedFep }));
      if (currentStep === 1) { // Only auto-advance if we are in step 1
        setCurrentStep(2); 
      }
    }
  }, [selectedFep, currentStep]);

  useEffect(() => {
    // Apply AI extracted data to form if available
    if (aiExtractedData) {
      setCceeFormState(prev => ({
        ...prev,
        fep: (aiExtractedData.fep as CceeScore) ?? prev.fep,
        oxygenNeed: (aiExtractedData.oxygenNeed as CceeScore) ?? prev.oxygenNeed,
        vitalSignsControl: (aiExtractedData.vitalSignsControl as CceeScore) ?? prev.vitalSignsControl,
        medicationAndNutrition: (aiExtractedData.medicationAndNutrition as CceeScore) ?? prev.medicationAndNutrition,
        unitSpecificScale: (aiExtractedData.unitSpecificScale as CceeScore) ?? prev.unitSpecificScale,
      }));
      // If AI suggested FEP, update selectedFep as well, this will trigger the above useEffect.
      if (aiExtractedData.fep && prevSelectedFepRef.current !== aiExtractedData.fep) {
         setSelectedFep(aiExtractedData.fep as CceeScore);
      }
    }
  }, [aiExtractedData]);
  
  // Ref to track previous selectedFep to avoid infinite loop with AI data setting
  const prevSelectedFepRef = useRef<CceeScore | undefined>();
  useEffect(() => {
    prevSelectedFepRef.current = selectedFep;
  });


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
    const { fep, oxygenNeed, vitalSignsControl, medicationAndNutrition, unitType, unitSpecificScale } = cceeFormState;
    if (
      fep &&
      oxygenNeed &&
      vitalSignsControl &&
      medicationAndNutrition &&
      unitType && 
      unitSpecificScale
    ) {
      const score =
        fep +
        oxygenNeed +
        vitalSignsControl +
        medicationAndNutrition +
        unitSpecificScale;
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

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleCaptureImage = (imageDataUrl: string) => {
    // console.log("Captured image data URL:", imageDataUrl); // For debugging
    // setCapturedImageData(imageDataUrl); // You can store this if needed
    toast({
      title: "Imagen Capturada",
      description: "La imagen ha sido capturada y está lista para ser procesada (funcionalidad futura).",
    });
    setShowCamera(false); // Close camera view after capture
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center">Identificación del Paciente (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-xs sm:max-w-sm">
                <Label htmlFor="patientId" className="text-center block mb-1">ID del Paciente / N° de Cama</Label>
                <Input
                  id="patientId"
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Ej: 12345 / Cama 10A"
                />
              </div>
              <Button variant="outline" onClick={handleOpenCamera} className="w-full max-w-xs sm:max-w-sm py-2 px-4 h-auto">
                <div className="flex flex-col items-center gap-1">
                  <Camera className="h-5 w-5" />
                  <span>Abrir Cámara</span>
                </div>
              </Button>
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
            <Button variant="outline" onClick={handleResetOrContinue} className="text-lg py-3 px-6">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reiniciar / Nuevo Paciente
            </Button>
          </div>

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        S.I.T.E.C.S Sistema Integral de Triaje para Evacuación de Centros Sanitarios - Aplicación de Ayuda &copy; {new Date().getFullYear()}
      </footer>

      <CameraView 
        isOpen={showCamera} 
        onClose={handleCloseCamera}
        onCapture={handleCaptureImage}
      />

      <AlertDialog open={isConfirmResetDialogOpen} onOpenChange={setIsConfirmResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cómo desea proceder?</AlertDialogTitle>
            <AlertDialogDescription>
              Se detectaron datos extraídos previamente por la IA. Puede iniciar un triaje completamente nuevo (borrando todos los datos) o continuar con los datos de la IA para el C.C.E.E. del siguiente paciente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmResetDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <Button variant="outline" onClick={continueWithAIData}>
              Continuar con Datos IA
            </Button>
            <AlertDialogAction onClick={performFullReset} className={buttonVariants({ variant: "destructive" })}>
              Limpiar Todo e Iniciar Nuevo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

    