import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLTableElement> {}

export default function Table(props: Props) {
  return <table {...props} />;
}
