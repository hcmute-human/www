import { cn } from '@lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

export interface StatisticCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  label: string;
  number: number;
}

export default function StatisticCard({
  icon,
  label,
  number,
  className,
  ...props
}: StatisticCardProps) {
  return (
    <div
      {...props}
      className={cn(
        'px-8 py-4 text-primary-700 flex gap-4 items-center justify-between rounded-lg bg-primary-50',
        className
      )}
    >
      <div className="font-bold">
        <p>{label}</p>
        <p className="text-4xl mt-0 leading-none">{number}</p>
      </div>
      {icon}
    </div>
  );
}
