
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RotateCcw, Camera, History, BookMarked } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { CceeFormState, CceeScore, TriagedPatient, FepLevel } from '@/types/triage';
import { addTriagedPatient } from '@/lib/triage-history-store';


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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const [showRetrieveDialog, setShowRetrieveDialog] = useState<boolean>(false);
  const [retrievePatientIdInput, setRetrievePatientIdInput] = useState<string>('');

  const { toast } = useToast();

  const performFullReset = useCallback(() => {
    setPatientId('');
    setSelectedFep(undefined);
    setCceeFormState(initialCceeFormState);
    setTotalCceeScore(null);
    setCurrentStep(1);
    setShowCamera(false);
    setCapturedImage(null);
    setShowRetrieveDialog(false);
    setRetrievePatientIdInput('');
    toast({ title: "Formulario Reiniciado Completamente", description: "Puede comenzar un nuevo triaje." });
  }, [toast]);

  useEffect(() => {
    if (selectedFep) {
      setCceeFormState(prev => ({ ...prev, fep: selectedFep }));
      if (currentStep === 1 && cceeFormState.fep !== selectedFep) { 
        setCurrentStep(2); 
      }
    }
  }, [selectedFep, currentStep, cceeFormState.fep]);
  
  const calculateTotalCceeScore = useCallback(() => {
    const { fep, oxygenNeed, vitalSignsControl, medicationAndNutrition, unitSpecificScale } = cceeFormState;
    if (
      fep &&
      oxygenNeed &&
      vitalSignsControl &&
      medicationAndNutrition &&
      // unitType is not needed for calculation, only for scale selection
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

      // Save to history store
      if (cceeFormState.fep !== undefined) { // Ensure FEP is selected
        const triagedPatientData: TriagedPatient = {
          triagedEntryId: Date.now().toString(),
          patientId: patientId || 'N/A', // Use entered patientId or 'N/A'
          capturedImage,
          fepScore: cceeFormState.fep as FepLevel, // selectedFep should be CceeScore which is FepLevel
          cceeFormState: { ...cceeFormState }, // Make a copy
          totalCceeScore: score,
          timestamp: Date.now(),
        };
        addTriagedPatient(triagedPatientData);
        toast({
          title: "Paciente Guardado en Historial",
          description: `El triaje para ${triagedPatientData.patientId} ha sido guardado en el historial de esta sesión.`,
        });
      }

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
    setCapturedImage(imageDataUrl);
    toast({
      title: "Imagen Capturada",
      description: "La imagen ha sido capturada y está disponible para el triaje C.C.E.E.",
    });
    setShowCamera(false); 
  };

  const handleOpenRetrieveDialog = () => {
    setRetrievePatientIdInput(''); 
    setShowRetrieveDialog(true);
  };

  const handleCloseRetrieveDialog = () => {
    setShowRetrieveDialog(false);
  };

  const handleConfirmRetrievePatient = () => {
    if (!retrievePatientIdInput.trim()) {
      toast({
        title: "ID Inválido",
        description: "Por favor, introduzca un ID de paciente.",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Simulating retrieval for patient ID: ${retrievePatientIdInput}`);
    
    let retrievedFep: CceeScore | undefined = undefined;
    let patientFound = false;

    if (retrievePatientIdInput.toUpperCase() === "RET-123") {
      setPatientId("RET-123");
      retrievedFep = 3 as CceeScore;
      patientFound = true;
      toast({
        title: "Paciente Recuperado",
        description: `Paciente ${retrievePatientIdInput} recuperado con F.E.P. ${retrievedFep}.`,
      });
    } else if (retrievePatientIdInput.toUpperCase() === "NOFEP-456") {
      setPatientId("NOFEP-456");
      retrievedFep = undefined; 
      patientFound = true;
      toast({
        title: "Paciente Encontrado (Sin F.E.P.)",
        description: `Se encontró al paciente ${retrievePatientIdInput}, pero no tiene un triaje F.E.P. previo. Por favor, seleccione un F.E.P.`,
      });
    } else {
      toast({
        title: "Paciente No Encontrado",
        description: `No se encontró información de triaje F.E.P. para el ID: ${retrievePatientIdInput}.`,
        variant: "destructive",
      });
    }

    if (patientFound) {
      setSelectedFep(retrievedFep);
      setCapturedImage(null); 
      setCceeFormState(prev => ({ 
        ...initialCceeFormState,
        fep: retrievedFep,
      }));
      setTotalCceeScore(null); 
      if (retrievedFep) {
        setCurrentStep(2); 
      } else {
        setCurrentStep(1); 
      }
    }
    handleCloseRetrieveDialog();
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
                  placeholder="Ej: 12345 / Cama 10A / NHC"
                  className="text-center"
                />
              </div>
              <Button variant="outline" onClick={handleOpenCamera} className="w-full max-w-xs sm:max-w-sm py-2 px-4 h-auto">
                <div className="flex flex-col items-center gap-1">
                  <Camera className="h-5 w-5" />
                  <span>Abrir Cámara / Leer código de barras / QR</span>
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
              capturedImage={capturedImage}
            />
          )}

          {currentStep === 3 && totalCceeScore !== null && (
            <ResourceDisplay cceeScore={totalCceeScore} />
          )}
          
          <Separator className="my-8" />

          <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-4">
            <Button variant="outline" onClick={performFullReset} className="text-lg py-3 px-6 w-full sm:w-auto">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reiniciar / Nuevo Paciente
            </Button>
            <Button variant="outline" onClick={handleOpenRetrieveDialog} className="text-lg py-3 px-6 w-full sm:w-auto">
              <History className="mr-2 h-5 w-5" />
              Recuperar Paciente Triado
            </Button>
            <Link href="/history" passHref legacyBehavior>
              <Button variant="outline" className="text-lg py-3 px-6 w-full sm:w-auto">
                <BookMarked className="mr-2 h-5 w-5" />
                Acceder a Pacientes Clasificados
              </Button>
            </Link>
          </div>

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>S.I.T.E.C.S Sistema Integral de Triaje para Evacuación de Centros Sanitarios - Aplicación de Ayuda &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">Pedro Omar Sevilla Moreno - ENFERMERO</p>
      </footer>

      <CameraView 
        isOpen={showCamera} 
        onClose={handleCloseCamera}
        onCapture={handleCaptureImage}
      />

      <Dialog open={showRetrieveDialog} onOpenChange={setShowRetrieveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Paciente Triado</DialogTitle>
            <DialogDescription>
              Introduzca el ID del Paciente / N° de Cama para recuperar su triaje F.E.P. previo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="retrieve-patient-id-input" className="text-right col-span-1">
                ID Paciente
              </Label>
              <Input
                id="retrieve-patient-id-input"
                value={retrievePatientIdInput}
                onChange={(e) => setRetrievePatientIdInput(e.target.value)}
                className="col-span-3"
                placeholder="Ej: RET-123"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseRetrieveDialog}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirmRetrievePatient}>
              Recuperar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
