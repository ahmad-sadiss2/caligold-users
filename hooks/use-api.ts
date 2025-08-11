import { useState, useCallback, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  immediate = false,
  ...immediateArgs: any[]
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null, success: false }));
      
      try {
        const result = await apiFunction(...args);
        setState({
          data: result,
          loading: false,
          error: null,
          success: true,
        });
      } catch (error) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred';
            
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(...immediateArgs);
    }
  }, [immediate, execute, ...immediateArgs]);

  return { ...state, execute, reset };
}

// Specific hooks for common operations
export function useBooking() {
  return useApi(api.booking.submit);
}

export function useContact() {
  return useApi(api.contact.submit);
}

export function useVehicles(page?: number, size?: number) {
  return useApi(() => api.vehicles.getAll(page, size), true, page, size);
}

export function useFeaturedVehicles() {
  return useApi(api.vehicles.getFeatured, true);
}

export function useVehicle(id: number) {
  return useApi(() => api.vehicles.getById(id), true, id);
}

export function useServices() {
  return useApi(api.services.getAll, true);
}

export function useService(id: number) {
  return useApi(() => api.services.getById(id), true, id);
}

export function useFAQs() {
  return useApi(api.faqs.getAll, true);
}

export function usePageContent(pageName: string) {
  return useApi(() => api.content.getByPage(pageName), true, pageName);
}

// Hook for managing form submissions with validation
export function useFormSubmission<T>(
  submitFunction: (data: T) => Promise<any>,
  onSuccess?: (result: any) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (data: T) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await submitFunction(data);
        setSuccess(true);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof ApiError 
          ? err.message 
          : err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred';
            
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submitFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset,
  };
} 