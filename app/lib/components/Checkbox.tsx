import { cn } from '@lib/utils';
import { forwardRef, type ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps,
} from 'react-aria-components';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

interface Props extends Omit<CheckboxProps, 'chilren'> {
  children?: ReactNode;
  checkboxClassName?: string;
}

const baseClass1 = 'group rounded outline-none';
const baseClass2 =
  'w-4 h-4 p-0.5 text-lg border border-neutral-300 rounded transition-[outline_background-color_border-color] ease-in-out group-rac-selected:bg-neutral-900 group-rac-selected:border-neutral-900 group-rac-focus-visible:outline-focus';
const baseClass3 =
  'stroke-neutral-50 transition-[stroke-dashoffset_stroke] ease-in-out duration-300 [stroke-dashoffset:66] group-rac-selected:[stroke-dashoffset:44]';

const InternalCheckbox = forwardRef<HTMLInputElement, Props>(
  function InternalCheckbox(
    { checkboxClassName, className, children, ...props }: Props,
    ref
  ) {
    return (
      <AriaCheckbox {...props} ref={ref} className={cn(baseClass1, className)}>
        <div className={cn(baseClass2, checkboxClassName)}>
          <svg
            viewBox="-2 -2 20 20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="3px"
            strokeDasharray="22px"
            strokeLinejoin="round"
            strokeLinecap="round"
            className={baseClass3}
          >
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
        <span className="text-sm text-neutral-700">{children}</span>
      </AriaCheckbox>
    );
  }
);

export default function Checkbox({ name, ...props }: Props) {
  return (
    <Controller
      name={name!}
      render={({
        field: { onChange, ...field },
        formState: { defaultValues },
      }) => (
        <InternalCheckbox
          {...field}
          {...props}
          defaultSelected={!!defaultValues?.[name!]}
          onChange={(selected) => {
            onChange(selected + '');
          }}
        />
      )}
    />
  );
}
