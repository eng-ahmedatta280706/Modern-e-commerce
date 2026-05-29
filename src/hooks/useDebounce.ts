import { useState, useEffect } from 'react';

/**
 * Delays updating a value until after the specified delay in ms.
 * Useful for search inputs to avoid firing API calls on every keystroke.
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
