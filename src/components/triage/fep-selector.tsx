
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
        <CardTitle className="text-xl text-center">1. Triaje Primario o Básico (F.E.P)</CardTitle>
        <CardDescription className="text-center">Seleccione la Facilidad de Evacuación del Paciente.</CardDescription>
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
                  src="/images/fep-flowchart.png"
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
              variant="ghost"
              className={cn(
                "h-auto p-4 flex flex-col items-center text-center whitespace-normal transition-all duration-150 ease-in-out transform hover:scale-105 focus:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                level.bgColorClassName,
                level.hoverBgColorClassName,
                level.textColorClassName,
                selectedFep === level.value
                  ? 'ring-2 ring-offset-1 ring-offset-background ring-foreground shadow-lg border border-foreground/50'
                  : 'border border-border',
                // Logic for centering items in the last row
                FEP_LEVELS.length % 3 === 1 && level.value === FEP_LEVELS[FEP_LEVELS.length -1].value ? 'lg:col-span-3 lg:w-1/3 lg:mx-auto md:col-span-2 md:w-1/2 md:mx-auto' :
                FEP_LEVELS.length % 3 === 2 && level.value === FEP_LEVELS[FEP_LEVELS.length -2].value ? 'lg:col-start-1 lg:w-auto' : // Ensure first of two starts normally
                FEP_LEVELS.length % 3 === 2 && level.value === FEP_LEVELS[FEP_LEVELS.length -1].value ? 'lg:col-start-2 lg:w-auto' : // Ensure second of two starts in second col
                FEP_LEVELS.length % 2 !== 0 && level.value === FEP_LEVELS[FEP_LEVELS.length -1].value && FEP_LEVELS.length % 3 !== 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''

              )}
              onClick={() => onFepSelect(level.value)}
            >
              {level.iconSrc && (
                <div className="relative w-12 h-10 mb-2">
                  <Image
                    src={level.iconSrc}
                    alt={`Icono para ${level.label}`}
                    fill
                    sizes="48px"
                    className="object-contain"
                    data-ai-hint={level.iconAiHint || "triage icon"}
                  />
                </div>
              )}
              <span className="font-semibold text-lg">{level.label}</span>
              <p className="text-sm mt-1 opacity-80">{level.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
