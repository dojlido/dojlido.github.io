// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook that applies debouncing to a value.
 * @param value - The value to be debounced.
 * @param delay - The delay in milliseconds for debouncing.
 * @returns The debounced value.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
