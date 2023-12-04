import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useRef, type ReactNode, useState } from 'react';
import type { SelectProps } from 'react-aria-components';
import { Button, Label, ListBox, Select, SelectValue, Text } from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
import Display from './Display';
import Popover from './Popover';

export interface UncontrolledSelectFieldProps<T extends object> extends Omit<SelectProps<T>, 'children' | 'name'> {
  name: string;
  children?: ReactNode | ((values: T) => ReactNode);
  label?: string;
  description?: string;
  errorMessage?: string;
  items?: Iterable<T>;
}

export default function UncontrolledSelectField<T extends object>({
  name,
  label,
  children,
  errorMessage,
  description,
  className,
  items,
  onBlur,
  ...props
}: UncontrolledSelectFieldProps<T>) {
  const invalid = props.isInvalid || !!errorMessage;
  const ref = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement | null>();

  useEffect(() => {
    selectRef.current = ref.current?.parentElement?.querySelector(`select[name="${name}"]`);
  }, []);

  return (
    <Select
      {...props}
      className={clsx('group outline-none', className)}
      isInvalid={invalid}
      name={name}
      ref={ref}
      onBlur={(e) => {
        selectRef.current?.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
        onBlur?.(e);
      }}
    >
      {label ? <Label className="cursor-default">{label}</Label> : null}
      <Button className="c-input group-invalid:border-negative-500 flex items-center transition-[outline] ease-in-out">
        <SelectValue className="truncate placeholder-shown:italic flex-1 text-left" />
        <ChevronUpDownIcon className="w-5 h-5 text-primary-500 group-invalid:text-negative-500" />
      </Button>
      <SwitchTransition state={invalid} timeout={200} mode="out-in">
        {(invalid, stage) => (
          <div
            className={clsx(
              'transition-opacity duration-200 text-sm',
              {
                from: 'opacity-0 ease-in',
                enter: '',
                leave: 'opacity-0 ease-out',
              }[stage]
            )}
          >
            {invalid ? (
              <Text slot="errorMessage" className="text-negative-500">
                <Display value={errorMessage ? errorMessage + (errorMessage.at(-1) === '.' ? '' : '.') : undefined} />
              </Text>
            ) : description ? (
              <Text slot="description" className="text-primary-700">
                {description + (description.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : null}
          </div>
        )}
      </SwitchTransition>
      <Popover className="w-[--trigger-width] p-1">
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </Select>
  );
}
