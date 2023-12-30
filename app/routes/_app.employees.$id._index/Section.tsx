import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Section({ children }: Props) {
  return <section className="p-4 border border-primary-100 rounded-lg bg-surface-2">{children}</section>;
}
