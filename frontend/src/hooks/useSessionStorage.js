/**
 * Custom hook for sessionStorage with error handling
 * Provides safe storage operations with fallbacks
 */

import { useState, useEffect, useCallback } from 'react';

export const useSessionStorage = (key, initialValue = null) => {
  // Get initial value from sessionStorage or use fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`SessionStorage read error for key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when state changes
  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`SessionStorage write error for key "${key}":`, error);
      // Continue without throwing - app should work even if storage fails
    }
  }, [key, storedValue]);

  // Custom setter with error handling
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`SessionStorage set error for key "${key}":`, error);
      // Still update state even if storage fails
      setStoredValue(value);
    }
  }, [key, storedValue]);

  // Remove item from storage
  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`SessionStorage remove error for key "${key}":`, error);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for localStorage with same pattern
export const useLocalStorage = (key, initialValue = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`LocalStorage read error for key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`LocalStorage write error for key "${key}":`, error);
    }
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`LocalStorage set error for key "${key}":`, error);
      setStoredValue(value);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`LocalStorage remove error for key "${key}":`, error);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useSessionStorage;
