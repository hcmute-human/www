import { clsx, type ClassValue } from 'clsx';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useNumericId() {
  return [...useId()].reduce<number>((acc, cur) => {
    acc += cur.charCodeAt(0);
    return acc;
  }, 0);
}

export function rgbToHex(rgb: string) {
  return `#${RegExp(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .exec(rgb)
    ?.slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')}`;
}
