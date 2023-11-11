import { cn } from '@lib/utils';
import { forwardRef, type ReactNode } from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps,
} from 'react-aria-components';
import { useFormFieldsContext } from './Form';

interface Props extends Omit<CheckboxProps, 'chilren'> {
  children?: ReactNode;
  checkboxClassName?: string;
}

const baseClass = {
  checkbox: 'group rounded outline-none',
  div: 'w-4 h-4 p-0.5 text-lg border border-primary-300 rounded transition-[outline_background-color_border-color] ease-in-out group-indeterminate:bg-primary-900 group-indeterminate:border-primary-900 group-selected:bg-primary-900 group-selected:border-primary-900 group-focus-visible:outline-focus',
  svg: 'stroke-primary-50',
};

const InternalCheckbox = forwardRef<HTMLInputElement, Props>(
  function InternalCheckbox(
    { checkboxClassName, className, children, ...props }: Props,
    ref
  ) {
    return (
      <AriaCheckbox
        {...props}
        ref={ref}
        className={cn(baseClass.checkbox, className)}
      >
        {({ isIndeterminate, isSelected }) => (
          <>
            <div className={cn(baseClass.div, checkboxClassName)}>
              <svg
                viewBox="-2 -2 20 20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="3px"
                strokeLinejoin="round"
                strokeLinecap="round"
                className={baseClass.svg}
              >
                {isIndeterminate ? (
                  <rect x={1} y={8.5} width={15} height={1} />
                ) : isSelected ? (
                  <polyline points="1 9 7 14 15 4" />
                ) : null}
              </svg>
            </div>
            {children ? (
              <span className="text-sm text-primary-700">{children}</span>
            ) : null}
          </>
        )}
      </AriaCheckbox>
    );
  }
);

const Checkbox = forwardRef<HTMLInputElement, Props>(function (props, ref) {
  const { [props.name as string]: field } = useFormFieldsContext() ?? {};
  return (
    <InternalCheckbox
      ref={ref}
      defaultSelected={field?.defaultValue}
      {...props}
    />
  );
});

export default Checkbox;
