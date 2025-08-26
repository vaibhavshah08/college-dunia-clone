import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useMemo } from "react";

export const useQueryParams = <T extends Record<string, any>>() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get all current query parameters
  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result as T;
  }, [searchParams]);

  // Set a single parameter
  const setParam = useCallback(
    (key: keyof T, value: string | number | boolean | null) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (value === null || value === "" || value === false) {
        newSearchParams.delete(key as string);
      } else {
        newSearchParams.set(key as string, String(value));
      }

      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Set multiple parameters
  const setParams = useCallback(
    (newParams: Partial<T>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === false) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Remove a parameter
  const removeParam = useCallback(
    (key: keyof T) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(key as string);
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Clear all parameters
  const clearParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Get a specific parameter
  const getParam = useCallback(
    (key: keyof T) => {
      return searchParams.get(key as string);
    },
    [searchParams]
  );

  // Check if a parameter exists
  const hasParam = useCallback(
    (key: keyof T) => {
      return searchParams.has(key as string);
    },
    [searchParams]
  );

  // Get array parameter (for filters like exams, facilities)
  const getArrayParam = useCallback(
    (key: keyof T) => {
      const value = searchParams.get(key as string);
      return value ? value.split(",").filter(Boolean) : [];
    },
    [searchParams]
  );

  // Set array parameter
  const setArrayParam = useCallback(
    (key: keyof T, values: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (values.length === 0) {
        newSearchParams.delete(key as string);
      } else {
        newSearchParams.set(key as string, values.join(","));
      }

      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Get number parameter with fallback
  const getNumberParam = useCallback(
    (key: keyof T, fallback?: number) => {
      const value = searchParams.get(key as string);
      const num = value ? parseInt(value, 10) : fallback;
      return isNaN(num!) ? fallback : num;
    },
    [searchParams]
  );

  // Set number parameter
  const setNumberParam = useCallback(
    (key: keyof T, value: number | null) => {
      setParam(key, value === null ? null : String(value));
    },
    [setParam]
  );

  return {
    // Current parameters
    params,

    // Parameter getters
    getParam,
    getArrayParam,
    getNumberParam,
    hasParam,

    // Parameter setters
    setParam,
    setParams,
    setArrayParam,
    setNumberParam,

    // Parameter removers
    removeParam,
    clearParams,

    // Raw search params (for advanced usage)
    searchParams,
    setSearchParams,
  };
};
