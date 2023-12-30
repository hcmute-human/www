import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: ReactNode;
  className?: string;
}

export default function Statistic({ label, children, className }: Props) {
  return (
    <div className={className}>
      <p className="text-primary-500 font-medium text-sm leading-none">{label}</p>
      <p>{children}</p>
    </div>
  );
}
