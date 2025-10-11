import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VariableButtonProps {
  variable: string;
  description: string;
  onInsert: (variable: string) => void;
  disabled?: boolean;
}

const VariableButton: React.FC<VariableButtonProps> = ({
  variable,
  description,
  onInsert,
  disabled = false
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsert(`{{${variable}}}`)}
            disabled={disabled}
            className="h-8 px-2 text-xs font-mono bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
          >
            {`{{${variable}}}`}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VariableButton;
