
'use client';

import type { CceeScore } from '@/types/triage';
import { FEP_LEVELS, type FepLevelOption } from '@/constants/triage-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FepSelectorProps {
  selectedFep: CceeScore | undefined;
  onFepSelect: (fep: CceeScore) => void;
}

export function FepSelector({ selectedFep, onFepSelect }: FepSelectorProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">1. Triaje Primario (F.E.P.)</CardTitle>
        <CardDescription>Seleccione la Facilidad de Evacuación del Paciente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full mb-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm hover:no-underline">
              Ver Diagrama de Flujo F.E.P. de Referencia
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative w-full aspect-[843/799] max-w-lg mx-auto bg-muted/30 rounded-md p-2">
                <Image
                  src="https://placehold.co/843x799.png"
                  alt="Diagrama de flujo para la selección de F.E.P."
                  width={843}
                  height={799}
                  className="rounded-md object-contain"
                  data-ai-hint="triage flowchart"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Este es un diagrama de ejemplo. Reemplácelo con su imagen del diagrama F.E.P.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(FEP_LEVELS as FepLevelOption[]).map((level) => (
            <Button
              key={level.value}
              // Removed variant prop to allow full style control via className
              className={cn(
                "h-auto p-4 flex flex-col items-start text-left whitespace-normal transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                level.color, // Applies bg-COLOR and hover:bg-COLOR from constants
                level.textColorClassName, // Applies text-COLOR from constants
                selectedFep === level.value
                  ? 'ring-2 ring-offset-1 ring-offset-background ring-foreground shadow-lg' // Style for selected
                  : 'border border-border' // Style for unselected
              )}
              onClick={() => onFepSelect(level.value)}
            >
              <span className="font-semibold text-lg">{level.label}</span>
              <p className="text-sm mt-1 opacity-80">{level.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
