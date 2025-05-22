
'use client';

import type { CceeScore, SelectOption } from '@/types/triage';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info } from 'lucide-react';

interface CceeCategoryInputProps {
  id: string;
  title: string;
  options: SelectOption<CceeScore>[];
  selectedValue: CceeScore | undefined;
  onValueChange: (value: CceeScore) => void;
  disabled?: boolean;
}

export function CceeCategoryInput({
  id,
  title,
  options,
  selectedValue,
  onValueChange,
  disabled = false,
}: CceeCategoryInputProps) {
  const [showDescriptions, setShowDescriptions] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">{title}</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDescriptions(!showDescriptions)}
          aria-label={showDescriptions ? "Ocultar descripciones" : "Mostrar descripciones"}
          className="px-2 py-1 h-auto"
        >
          <Info className="h-4 w-4 mr-1" />
          {showDescriptions ? 'Ocultar' : 'Ayuda'}
        </Button>
      </div>
      <RadioGroup
        value={selectedValue?.toString()}
        onValueChange={(val) => onValueChange(parseInt(val) as CceeScore)}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3 p-2 border rounded-md hover:bg-accent/20 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`${id}-${option.value}`} className="mt-1 shrink-0" />
            <div className="flex-grow">
              <Label htmlFor={`${id}-${option.value}`} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              {showDescriptions && (
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line">{option.description}</p>
              )}
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
