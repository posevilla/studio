
'use client';

import type { CceeScore } from '@/types/triage';
import { FEP_LEVELS } from '@/constants/triage-data';
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
          {FEP_LEVELS.map((level) => (
            <Button
              key={level.value}
              variant={selectedFep === level.value ? 'default' : 'outline'}
              className={cn(
                "h-auto p-4 flex flex-col items-start text-left whitespace-normal transition-all duration-150 ease-in-out transform hover:scale-105",
                selectedFep === level.value ? level.color : 'border-border hover:bg-accent/50',
                selectedFep === level.value && level.value === 2 ? 'text-black hover:text-black' : (selectedFep === level.value ? 'text-primary-foreground hover:text-primary-foreground' : 'text-foreground')
              )}
              onClick={() => onFepSelect(level.value)}
            >
              <span className={cn("font-semibold text-lg", selectedFep === level.value && level.value !== 2 ? 'text-primary-foreground' : (selectedFep === level.value && level.value === 2 ? 'text-black' : 'text-primary'))}>{level.label}</span>
              <p className={cn("text-sm mt-1", selectedFep === level.value ? (level.value === 2 ? 'text-muted-foreground' : 'text-primary-foreground/80') : 'text-muted-foreground')}>{level.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
