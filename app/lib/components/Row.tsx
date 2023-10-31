import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableRowElement> {}

export default function Row(props: Props) {
  return <tr {...props} />;
}
