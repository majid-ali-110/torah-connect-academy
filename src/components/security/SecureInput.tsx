
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeInput } from '@/utils/inputValidation';

interface SecureInputProps {
  id: string;
  type: string;
  value: string;
  onSecureChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

const SecureInput: React.FC<SecureInputProps> = ({
  id,
  type,
  value,
  onSecureChange,
  placeholder,
  required = false,
  maxLength = 255,
  className
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Apply length limit
    if (rawValue.length > maxLength) {
      return;
    }
    
    // Sanitize input
    const sanitizedValue = sanitizeInput(rawValue);
    
    setIsDirty(true);
    onSecureChange(sanitizedValue);
  }, [onSecureChange, maxLength]);

  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className={className}
      autoComplete={type === 'password' ? 'current-password' : 'on'}
    />
  );
};

export default SecureInput;
