
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { validatePassword } from '@/utils/inputValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const { errors } = validatePassword(password);
    
    // Calculate score based on criteria met
    score = Math.max(0, 5 - errors.length) * 20;
    
    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 60) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score < 80) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className={`text-xs font-medium ${
          strength.score < 40 ? 'text-red-600' :
          strength.score < 60 ? 'text-orange-600' :
          strength.score < 80 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>
      <Progress value={strength.score} className="h-2" />
    </div>
  );
};

export default PasswordStrengthIndicator;
