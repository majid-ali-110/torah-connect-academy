
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeHtml, validateTextLength } from '@/utils/inputValidation';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string) => void;
  maxLength?: number;
  allowHtml?: boolean;
  showCharCount?: boolean;
}

const SecureInput: React.FC<SecureInputProps> = ({
  onSecureChange,
  maxLength = 1000,
  allowHtml = false,
  showCharCount = false,
  onChange,
  value = '',
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value?.toString() || '');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setLocalValue(value?.toString() || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Sanitize input if HTML is not allowed
    if (!allowHtml) {
      newValue = sanitizeHtml(newValue);
    }
    
    // Validate length
    const lengthValid = validateTextLength(newValue, maxLength);
    setIsValid(lengthValid || newValue.length === 0);
    
    // Truncate if exceeds max length
    if (newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }
    
    setLocalValue(newValue);
    
    // Call both handlers
    if (onSecureChange) {
      onSecureChange(newValue);
    }
    
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: newValue }
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      <Input
        {...props}
        value={localValue}
        onChange={handleChange}
        className={`${props.className || ''} ${!isValid ? 'border-red-500' : ''}`}
      />
      {showCharCount && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {localValue.length}/{maxLength}
        </div>
      )}
      {!isValid && (
        <div className="mt-1 text-xs text-red-600">
          Input exceeds maximum length of {maxLength} characters
        </div>
      )}
    </div>
  );
};

export default SecureInput;
