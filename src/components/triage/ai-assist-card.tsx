'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface AiAssistCardProps {
  patientNotes: string;
  setPatientNotes: Dispatch<SetStateAction<string>>;
  labResults: string;
  setLabResults: Dispatch<SetStateAction<string>>;
  onExtractData: () => Promise<void>;
  isProcessing: boolean;
  disabled?: boolean;
}

export function AiAssistCard({
  patientNotes,
  setPatientNotes,
  labResults,
  setLabResults,
  onExtractData,
  isProcessing,
  disabled = false,
}: AiAssistCardProps) {
  return (
    <Card className="w-full shadow-md bg-background/70">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          Asistente IA para C.C.E.E.
        </CardTitle>
        <CardDescription>
          Ingrese las notas del paciente y los resultados de laboratorio para pre-rellenar automáticamente los campos del formulario C.C.E.E. 
          <strong className="block mt-1">Siempre verifique los datos sugeridos por la IA.</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="patientNotes" className="text-sm font-medium">Notas del Paciente</Label>
          <Textarea
            id="patientNotes"
            placeholder="Observaciones, historia médica, etc."
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
            className="mt-1 min-h-[100px]"
            disabled={disabled || isProcessing}
          />
        </div>
        <div>
          <Label htmlFor="labResults" className="text-sm font-medium">Resultados de Laboratorio</Label>
          <Textarea
            id="labResults"
            placeholder="Resultados de análisis de sangre, etc."
            value={labResults}
            onChange={(e) => setLabResults(e.target.value)}
            className="mt-1 min-h-[100px]"
            disabled={disabled || isProcessing}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onExtractData} disabled={disabled || isProcessing || (!patientNotes && !labResults)} className="w-full sm:w-auto">
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Extraer Datos con IA
        </Button>
      </CardFooter>
    </Card>
  );
}
