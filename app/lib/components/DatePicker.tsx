import { ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@lib/utils';
import type { DatePickerProps, DateValue } from 'react-aria-components';
import {
  DatePicker as AriaDatePicker,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Text,
} from 'react-aria-components';
import Button from './Button';
import Popover from './Popover';
import Label from './Label';
import { SwitchTransition } from 'transition-hook';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useFormFieldsContext } from './Form';

interface Props extends DatePickerProps<DateValue> {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export default function DatePicker({
  label,
  className,
  errorMessage,
  description,
  isInvalid,
  isRequired,
  ...props
}: Props) {
  const { [props.name]: field } = useFormFieldsContext() ?? {};
  errorMessage ??= field?.error;
  const [errorDisplay, setErrorDisplay] = useState(errorMessage);
  const invalid = !!errorMessage;
  const groupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    setErrorDisplay(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current = groupRef.current!.getElementsByTagName(`input`)[0];
  }, []);

  return (
    <AriaDatePicker
      {...props}
      isInvalid={isInvalid || invalid}
      isRequired={isRequired}
      className={cn('group focus-within:outline-none', className)}
      onBlur={() => {
        inputRef.current?.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
      }}
      defaultValue={field.defaultValue}
    >
      {label ? (
        <Label className="cursor-default mb-0.5 flex items-center gap-1 flex-wrap">
          {label}
          {isRequired ? <span className="text-primary-300 text-xs font-medium">(required)</span> : null}
          {props.isReadOnly ? <span className="text-info-500 text-xs font-medium">(read-only)</span> : null}
        </Label>
      ) : null}
      <Group className="c-input flex py-0 pr-0 group-data-[invalid]:border-negative-500" ref={groupRef}>
        <DateInput className="flex flex-1 py-2 focus-within:outline-none">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-0.5 leading-none tabular-nums outline-none rounded-sm focus:bg-accent-500 focus:text-primary-50 caret-transparent placeholder-shown:italic"
            />
          )}
        </DateInput>
        <Button
          variant="primary"
          className="bg-transparent rounded-l-none rounded-r border-l border-l-primary-200 text-primary-500 group-data-[invalid]:border-l-negative-500"
          size="sm"
        >
          <ChevronUpDownIcon className="w-5 h-5 group-invalid:text-negative-500" />
        </Button>
      </Group>
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
                {errorDisplay + (errorDisplay?.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : description ? (
              <Text slot="description" className="text-primary-700">
                {description + (description.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : null}
          </div>
        )}
      </SwitchTransition>
      <Popover>
        <Dialog className="p-4">
          <Calendar>
            <header className="flex items-center gap-1 pb-4 px-1 font-serif w-full">
              <Heading className="flex-1 font-semibold text-2xl ml-2" />
              <Button slot="previous" size="sm" variant="primary">
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <Button slot="next" size="sm" variant="primary">
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </header>
            <CalendarGrid className="border-spacing-1 border-separate">
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className="text-xs font-semibold">{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className="w-9 h-9 outline-none cursor-default rounded-full flex items-center justify-center transition ease-in-out duration-75 outside-month:text-primary-300 hover:bg-primary-100 pressed:bg-accent-500 pressed:text-primary-50 selected:bg-accent-500 selected:text-primary-50"
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
