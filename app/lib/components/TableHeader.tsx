import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableSectionElement> {}

export default function TableHeader({ ...props }: Props) {
  return <thead {...props} />;
}
