
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
  const [expandedOptionValue, setExpandedOptionValue] = useState<CceeScore | string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">{title}</h4>
        {/* Global help button removed as per new requirement for per-option help */}
      </div>
      <RadioGroup
        value={selectedValue?.toString()}
        onValueChange={(val) => {
          onValueChange(parseInt(val) as CceeScore);
          setExpandedOptionValue(null); // Collapse description when selection changes
        }}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3 p-2 border rounded-md hover:bg-accent/20 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`${id}-${option.value}`} className="mt-1 shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-${option.value}`} className="font-medium cursor-pointer flex-grow py-1">
                  {option.label}
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 ml-2"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent radio selection if clicking on info button
                    setExpandedOptionValue(current => current === option.value ? null : option.value);
                  }}
                  aria-label={`Mostrar descripción para ${option.label}`}
                  title={`Mostrar/ocultar descripción para ${option.label}`}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              {expandedOptionValue === option.value && (
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line pb-1">{option.description}</p>
              )}
            </div>
            {selectedValue === option.value && (
               <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

