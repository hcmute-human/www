import { useEffect, useState } from 'react';

export function useTruthy<T>(value: T): NonNullable<T> {
  const [truthyValue, setTruthyValue] = useState(value);
  useEffect(() => {
    if (value) {
      setTruthyValue(value);
    }
  }, [value]);
  return truthyValue!;
}
