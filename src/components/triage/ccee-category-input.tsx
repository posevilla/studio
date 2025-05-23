
'use client';

import type { CceeScore, SelectOption } from '@/types/triage';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Info } from 'lucide-react';

// Make CceeScore a union of specific numbers if it's not already globally defined as such.
// For this component, TValue can be CceeScore (numeric) or string (like UnitType)
interface CceeCategoryInputProps<TValue extends string | CceeScore> {
  id: string;
  title: string;
  options: SelectOption<TValue>[];
  selectedValue: TValue | undefined;
  onValueChange: (value: TValue) => void;
  disabled?: boolean;
}

export function CceeCategoryInput<TValue extends string | CceeScore>({
  id,
  title,
  options,
  selectedValue,
  onValueChange,
  disabled = false,
}: CceeCategoryInputProps<TValue>) {
  const [expandedOptionValue, setExpandedOptionValue] = useState<TValue | string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">{title}</h4>
      </div>
      <RadioGroup
        value={selectedValue?.toString()} // RadioGroup value is always string
        onValueChange={(valStr: string) => {
          let newValue: TValue;
          // Check the type of the first option's value to determine if we need to parseInt
          if (options.length > 0 && typeof options[0].value === 'number') {
            newValue = parseInt(valStr) as TValue;
          } else {
            newValue = valStr as TValue;
          }
          onValueChange(newValue);
          setExpandedOptionValue(null); // Collapse description when selection changes
        }}
        className="space-y-2"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value.toString()} className="flex items-start space-x-3 p-2 border rounded-md hover:bg-accent/20 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`${id}-${option.value.toString()}`} className="mt-1 shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-${option.value.toString()}`} className="font-medium cursor-pointer flex-grow py-1">
                  {option.label}
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 ml-2"
                  onClick={(e) => {
                    e.preventDefault(); 
                    setExpandedOptionValue(current => current?.toString() === option.value.toString() ? null : option.value);
                  }}
                  aria-label={`Mostrar descripción para ${option.label}`}
                  title={`Mostrar/ocultar descripción para ${option.label}`}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              {expandedOptionValue?.toString() === option.value.toString() && (
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-line pb-1">{option.description}</p>
              )}
            </div>
            {selectedValue?.toString() === option.value.toString() && (
               <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
