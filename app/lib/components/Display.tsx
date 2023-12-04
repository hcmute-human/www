import { useState, type ReactNode, useEffect } from 'react';

interface Props {
  value: ReactNode;
}

export default function Display({ value }: Props) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (value) {
      setDisplay(value);
    }
  }, [value]);
  return display;
}
