import type { Submission } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { clsx, type ClassValue } from 'clsx';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';
import type { ZodTypeAny, output } from 'zod';

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
    .map((x) => parseInt(x, 10).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function displayP3ToHex(rgb: string) {
  return `#${RegExp(/^color\(display-p3\s([\d.]+)\s*([\d.]+)\s*([\d.]+)\)$/)
    .exec(rgb)
    ?.slice(1)
    .map((x) =>
      Math.round(Number(x) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

type SubmissionWithOk<Schema extends ZodTypeAny> =
  | ({ ok: true; value: Schema } & Omit<Submission<Schema>, 'value'>)
  | ({ ok: false } & Omit<Submission<Schema>, 'value'>);

export async function parseSubmissionAsync<Schema extends ZodTypeAny>(
  formData: FormData,
  config: Omit<Parameters<typeof parse<Schema>>[1], 'async'>
): Promise<SubmissionWithOk<output<Schema>>> {
  const submission = await parse<Schema>(formData, { ...config, async: true });
  return {
    ...submission,
    ok: submission.intent === 'submit' && !!submission.value,
  } as SubmissionWithOk<output<Schema>>;
}

export function parseSubmission<Schema extends ZodTypeAny>(
  formData: FormData,
  config: Omit<Parameters<typeof parse<Schema>>[1], 'async'>
): SubmissionWithOk<output<Schema>> {
  const submission = parse<Schema>(formData, config);
  return {
    ...submission,
    ok: submission.intent === 'submit' && !!submission.value,
  } as SubmissionWithOk<output<Schema>>;
}
