import { Suspense, type ReactNode } from 'react';
import type { StatisticCardProps } from './StatisticCard';
import { Await } from '@remix-run/react';
import StatisticCard from './StatisticCard';
import { cn } from '@lib/utils';
import ProgressCircle from '@components/ProgressCircle';

interface Props extends Omit<StatisticCardProps, 'number'> {
  resolve: Promise<ReactNode>;
  defaultNumber?: number;
}

export default function AsyncStatisticCard({ resolve, label, icon, defaultNumber = 0, className, ...props }: Props) {
  return (
    <Suspense
      fallback={
        <StatisticCard
          number={defaultNumber}
          icon={<ProgressCircle className="w-10 h-10" aria-label="Loading" />}
          label={label}
          className={cn('animate-twPulse', className)}
          {...props}
        />
      }
    >
      <Await resolve={resolve}>
        {(x) => <StatisticCard number={x} icon={icon} label={label} className={className} {...props} />}
      </Await>
    </Suspense>
  );
}
