'use client';

import type { ResourceRecommendation } from '@/types/triage';
import { getResourceRecommendation } from '@/constants/triage-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Ambulance, Users } from 'lucide-react';

interface ResourceDisplayProps {
  cceeScore: number | null;
}

export function ResourceDisplay({ cceeScore }: ResourceDisplayProps) {
  if (cceeScore === null) {
    return null;
  }

  const recommendation: ResourceRecommendation | undefined = getResourceRecommendation(cceeScore);

  return (
    <Card className="w-full shadow-lg bg-gradient-to-br from-primary/20 to-accent/20">
      <CardHeader>
        <CardTitle className="text-xl">3. Recomendación de Recursos para Evacuación</CardTitle>
        <CardDescription>Basado en la puntuación C.C.E.E. de <span className="font-bold text-primary">{cceeScore}</span>.</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendation ? (
          <div className="space-y-4 p-4 bg-background/80 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Ambulance className="h-8 w-8 text-primary mr-3 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Recurso Móvil:</p>
                <p className="text-lg font-semibold text-foreground">{recommendation.type}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Tripulación Necesaria:</p>
                <p className="text-lg font-semibold text-foreground">{recommendation.crew}</p>
              </div>
            </div>
             <p className="text-xs text-muted-foreground pt-2">Rango de puntuación C.C.E.E.: {recommendation.scoreRange}</p>
          </div>
        ) : (
          <div className="flex items-center p-4 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-destructive mr-3 shrink-0" />
            <p className="text-destructive-foreground">No se pudo determinar una recomendación para la puntuación {cceeScore}. Verifique la puntuación o consulte el manual.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
