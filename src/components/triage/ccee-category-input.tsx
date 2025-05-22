'use client';

import type { CceeScore, SelectOption } from '@/types/triage';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CceeCategoryInputProps {
  id: string;
  title: string;
  options: SelectOption<CceeScore>[];
  selectedValue: CceeScore | undefined;
  onValueChange: (value: CceeScore) => void;
  aiSuggestion?: CceeScore;
  aiReasoning?: string;
  disabled?: boolean;
}

export function CceeCategoryInput({
  id,
  title,
  options,
  selectedValue,
  onValueChange,
  aiSuggestion,
  aiReasoning,
  disabled = false,
}: CceeCategoryInputProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-md font-semibold text-foreground">{title}</h4>
      <RadioGroup
        value={selectedValue?.toString()}
        onValueChange={(val) => onValueChange(parseInt(val) as CceeScore)}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/20 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`${id}-${option.value}`} className="mt-1 shrink-0" />
            <div className="flex-grow">
              <Label htmlFor={`${id}-${option.value}`} className="font-medium cursor-pointer">
                {option.label}
                {aiSuggestion === option.value && (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="ml-2 border-primary text-primary bg-primary/10">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          AI Sugerencia
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm p-2 bg-popover text-popover-foreground shadow-md rounded-md">
                        <p className="font-semibold">Razón de la IA:</p>
                        <p>{aiReasoning || "No se proporcionó razonamiento específico."}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </div>
            {selectedValue === option.value && (
               <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
