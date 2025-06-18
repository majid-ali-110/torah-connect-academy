
import React from 'react';
import { validatePassword } from '@/utils/inputValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = ''
}) => {
  const { isValid, errors } = validatePassword(password);
  
  const getStrengthLevel = () => {
    if (password.length === 0) return 0;
    if (errors.length >= 4) return 1;
    if (errors.length >= 2) return 2;
    if (errors.length >= 1) return 3;
    return 4;
  };

  const strengthLevel = getStrengthLevel();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  if (password.length === 0) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full ${
              level <= strengthLevel ? strengthColors[strengthLevel] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <div className="text-sm">
        <span className={`font-medium ${strengthLevel >= 3 ? 'text-green-600' : 'text-red-600'}`}>
          {strengthLabels[strengthLevel]}
        </span>
        {errors.length > 0 && (
          <ul className="mt-1 text-xs text-red-600">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
