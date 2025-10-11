import React, { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import VariableButton from './VariableButton';

interface Variable {
  name: string;
  description: string;
}

interface VariableTextEditorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variables: Variable[];
  description?: string;
  rows?: number;
  tooltipContent?: React.ReactNode;
}

const VariableTextEditor: React.FC<VariableTextEditorProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  variables,
  description,
  rows = 4,
  tooltipContent
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + variable + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the inserted variable
    setTimeout(() => {
      const newPosition = start + variable.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {tooltipContent && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent 
                className="max-w-md w-max" 
                side="top" 
                align="start"
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
              >
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Variable Buttons */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md border border-gray-200">
        <span className="text-xs text-gray-600 mr-2 self-center">Insert variables:</span>
        {variables.map((variable) => (
          <VariableButton
            key={variable.name}
            variable={variable.name}
            description={variable.description}
            onInsert={handleInsertVariable}
          />
        ))}
      </div>
      
      {/* Text Editor */}
      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none font-mono text-sm"
      />
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default VariableTextEditor;
