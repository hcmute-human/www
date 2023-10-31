import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableSectionElement> {}

export default function TableBody<T extends object>(props: Props) {
  return <tbody {...props} />;
}
