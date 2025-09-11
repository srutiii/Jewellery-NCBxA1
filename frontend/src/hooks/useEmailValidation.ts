import { useState, useEffect, useCallback } from 'react';
import { firebaseService } from '@/services/firebaseService';

interface EmailValidationState {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  isAvailable: boolean;
}

export const useEmailValidation = (email: string, debounceMs: number = 500) => {
  const [state, setState] = useState<EmailValidationState>({
    isValid: true,
    isChecking: false,
    error: null,
    isAvailable: true,
  });

  const checkEmailAvailability = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      setState(prev => ({
        ...prev,
        isValid: true,
        isChecking: false,
        error: null,
        isAvailable: true,
      }));
      return;
    }

    setState(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const response = await firebaseService.checkEmailAvailability(emailToCheck);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          isValid: false,
          isChecking: false,
          error: response.error || 'Failed to check email availability',
          isAvailable: false,
        }));
      } else {
        const isAvailable = response.data?.available ?? false;
        setState(prev => ({
          ...prev,
          isValid: isAvailable,
          isChecking: false,
          error: isAvailable ? null : 'This email address is already registered',
          isAvailable,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isValid: false,
        isChecking: false,
        error: 'Failed to validate email',
        isAvailable: false,
      }));
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkEmailAvailability(email);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [email, debounceMs, checkEmailAvailability]);

  return state;
};

