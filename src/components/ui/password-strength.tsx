import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-muted' };

    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
      password.length >= 12
    ];

    score = checks.filter(Boolean).length;

    if (score < 2) return { score: 16, label: 'Zwak', color: 'bg-destructive' };
    if (score < 4) return { score: 40, label: 'Matig', color: 'bg-orange-500' };
    if (score < 5) return { score: 70, label: 'Goed', color: 'bg-yellow-500' };
    return { score: 100, label: 'Sterk', color: 'bg-green-500' };
  };

  const { score, label, color } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Wachtwoord sterkte</span>
        <span className={cn("font-medium", {
          'text-destructive': score < 40,
          'text-orange-500': score >= 40 && score < 70,
          'text-yellow-600': score >= 70 && score < 100,
          'text-green-600': score === 100
        })}>
          {label}
        </span>
      </div>
      <div className="relative">
        <Progress value={score} className="h-2" />
        <div 
          className={cn("absolute top-0 left-0 h-2 rounded-full transition-all duration-300", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      {password && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex flex-wrap gap-2">
            <span className={password.length >= 8 ? "text-green-600" : "text-muted-foreground"}>
              ✓ 8+ karakters
            </span>
            <span className={/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
              ✓ Hoofdletter
            </span>
            <span className={/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}>
              ✓ Cijfer
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export { PasswordStrength };