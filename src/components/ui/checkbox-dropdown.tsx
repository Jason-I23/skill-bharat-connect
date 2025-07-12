
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Label } from './label';

interface CheckboxDropdownProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  className?: string;
  maxSelections?: number; // Add support for limiting selections
}

export const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  className,
  maxSelections
}) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      // If maxSelections is 1, replace the selection instead of adding
      if (maxSelections === 1) {
        onSelectionChange([value]);
      } else {
        onSelectionChange([...selectedValues, value]);
      }
    } else {
      onSelectionChange(selectedValues.filter(v => v !== value));
    }
  };

  const displayText = selectedValues.length > 0 
    ? maxSelections === 1 
      ? selectedValues[0] 
      : `${selectedValues.length} selected`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between ${className}`}
        >
          {displayText}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="max-h-60 overflow-y-auto p-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <Checkbox
                id={option}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              />
              <Label htmlFor={option} className="text-sm cursor-pointer flex-1">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
