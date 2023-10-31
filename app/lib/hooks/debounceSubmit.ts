import { useSubmit, type SubmitFunction } from '@remix-run/react';
import { useDebouncyFn } from 'use-debouncy';

export function useDebounceSubmit(delayMs: number) {
  const submit = useSubmit();
  return useDebouncyFn(
    (
      target: Parameters<SubmitFunction>[0],
      options?: Parameters<SubmitFunction>[1]
    ) => submit(target, options),
    delayMs
  );
}
