
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'; // Import next/image
import { AppHeader } from '@/components/layout/app-header';
import { FepSelector } from '@/components/triage/fep-selector';
import { CceeForm } from '@/components/triage/ccee-form';
import { ResourceDisplay } from '@/components/triage/resource-display';
import { CameraView } from '@/components/triage/camera-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { CceeFormState, CceeScore } from '@/types/triage';


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
    
  const [totalCceeScore, setTotalCceeScore] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // State for captured image
  
  const { toast } = useToast();

  const performFullReset = useCallback(() => {
    setPatientId('');
    setSelectedFep(undefined);
    setCceeFormState(initialCceeFormState);
    setTotalCceeScore(null);
    setCurrentStep(1);
    setShowCamera(false);
    setCapturedImage(null); // Reset captured image
    toast({ title: "Formulario Reiniciado Completamente", description: "Puede comenzar un nuevo triaje." });
  }, [toast]);

  useEffect(() => {
    if (selectedFep) {
      setCceeFormState(prev => ({ ...prev, fep: selectedFep }));
      if (currentStep === 1) { // Only auto-advance if we are in step 1
        setCurrentStep(2); 
      }
    }
  }, [selectedFep, currentStep]);
  
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
    setCapturedImage(imageDataUrl); // Store captured image data URL
    toast({
      title: "Imagen Capturada",
      description: "La imagen ha sido capturada.",
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
              onFormComplete={handleCceeFormComplete}
              totalCceeScore={totalCceeScore}
              capturedImage={capturedImage} // Pass captured image
            />
          )}

          {currentStep === 3 && totalCceeScore !== null && (
            <ResourceDisplay cceeScore={totalCceeScore} />
          )}
          
          <Separator className="my-8" />

          <div className="flex justify-center">
            <Button variant="outline" onClick={performFullReset} className="text-lg py-3 px-6">
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

    </div>
  );
}
