
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Info } from 'lucide-react';
import type { TriagedPatient } from '@/types/triage';
import { getTriagedPatients } from '@/lib/triage-history-store';
import { UNIT_TYPES, getFepLevelInfo } from '@/constants/triage-data';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const [history, setHistory] = useState<TriagedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHistory(getTriagedPatients());
    setIsLoading(false);
  }, []);

  const getUnitTypeLabel = (unitValue: string | undefined) => {
    if (!unitValue) return 'N/A';
    const unitType = UNIT_TYPES.find(u => u.value === unitValue);
    return unitType ? unitType.label : 'Desconocido';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <p>Cargando historial...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Historial de Pacientes Clasificados (Sesión Actual)</CardTitle>
            <Link href="/" passHref legacyBehavior>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Triaje
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Historial Vacío</AlertTitle>
                <AlertDescription>
                  No hay pacientes clasificados en esta sesión. Complete un triaje para verlo aquí.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Lista de pacientes triados durante esta sesión.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID Paciente</TableHead>
                      <TableHead className="w-[80px]">Foto</TableHead>
                      <TableHead>F.E.P.</TableHead>
                      <TableHead>O2</TableHead>
                      <TableHead>Const.</TableHead>
                      <TableHead>Med/Nutr</TableHead>
                      <TableHead>U.Tipo</TableHead>
                      <TableHead>U.Escala</TableHead>
                      <TableHead>Total CCEE</TableHead>
                      <TableHead className="w-[150px]">Fecha/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((patient) => {
                      const fepInfo = patient.fepScore ? getFepLevelInfo(patient.fepScore) : null;
                      return (
                        <TableRow key={patient.triagedEntryId}>
                          <TableCell className="font-medium">{patient.patientId}</TableCell>
                          <TableCell>
                            {patient.capturedImage ? (
                              <Image
                                src={patient.capturedImage}
                                alt={`Foto de ${patient.patientId}`}
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                                data-ai-hint="patient identification"
                              />
                            ) : (
                              <div className="w-[50px] h-[50px] bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                                Sin foto
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {patient.fepScore !== undefined ? (
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-semibold",
                                    fepInfo?.bgColorClassName,
                                    fepInfo?.textColorClassName
                                )}>
                                    {patient.fepScore}
                                </span>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>{patient.cceeFormState.oxygenNeed ?? 'N/A'}</TableCell>
                          <TableCell>{patient.cceeFormState.vitalSignsControl ?? 'N/A'}</TableCell>
                          <TableCell>{patient.cceeFormState.medicationAndNutrition ?? 'N/A'}</TableCell>
                          <TableCell>{getUnitTypeLabel(patient.cceeFormState.unitType)}</TableCell>
                          <TableCell>{patient.cceeFormState.unitSpecificScale ?? 'N/A'}</TableCell>
                          <TableCell className="font-semibold">{patient.totalCceeScore ?? 'N/A'}</TableCell>
                          <TableCell>{new Date(patient.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>S.I.T.E.C.S Sistema Integral de Triaje para Evacuación de Centros Sanitarios - Aplicación de Ayuda &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1">Pedro Omar Sevilla Moreno - ENFERMERO</p>
      </footer>
    </div>
  );
}
