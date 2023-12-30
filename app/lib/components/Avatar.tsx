import { cn } from '@lib/utils';
import clsx from 'clsx';
import { type ImgHTMLAttributes } from 'react';
import { type AvatarFullConfig } from 'react-nice-avatar';
import { ClientOnly } from 'remix-utils/client-only';
import ClientOnlyAvatar from './ClientOnlyAvatar.client';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackConfig?: string | AvatarFullConfig;
}

const baseClass = 'aspect-square max-w-full h-auto object-cover object-center rounded-full border border-primary-200';

export default function Avatar({ src, fallbackConfig, className, ...props }: Props) {
  if (src) {
    return <img src={src} className={cn(baseClass, className)} {...props} />;
  }

  const fallback = <div className={clsx(baseClass, 'bg-primary-50', className)} />;
  if (fallbackConfig) {
    return (
      <ClientOnly fallback={fallback}>
        {() => <ClientOnlyAvatar config={fallbackConfig!} className={cn(baseClass, className)} />}
      </ClientOnly>
    );
  }

  return fallback;
}
