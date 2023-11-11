import {
  Listbox as HeadlessUiListbox,
  Transition,
  type ListboxProps as HeadlessUiListboxProps,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, type Key, type ReactNode } from 'react';

type Props<TType, TActualType> = Omit<
  HeadlessUiListboxProps<'div', TType, TActualType>,
  'value' | 'onChange'
> & {
  items: TType[];
  placement?: 'top' | 'bottom';
  value?: TType;
  onChange?(value: TType): void;
  render(value: TType): ReactNode;
};

export function Listbox<TType extends { id: Key }, TActualType>({
  items,
  render,
  className,
  placement = 'top',
  ...props
}: Props<TType, TActualType>) {
  return (
    <HeadlessUiListbox<'div', TType, TActualType> {...props}>
      {({ open, value }) => (
        <>
          <div className={clsx('relative', className)}>
            <HeadlessUiListbox.Button className="font-bold leading-none relative w-full cursor-default rounded-md bg-primary-0 py-2 pl-2 pr-6 text-left shadow-sm border border-primary-200 focus-visible:outline-focus">
              <span className="block truncate">{render(value)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <ChevronUpDownIcon
                  className="h-4 w-4 text-primary-300"
                  aria-hidden="true"
                />
              </span>
            </HeadlessUiListbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition transform ease-in-out"
              enterFrom="-translate-y-2 opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0 -translate-y-2"
            >
              <HeadlessUiListbox.Options
                className={clsx(
                  'absolute z-10 w-full overflow-auto rounded-md bg-primary-0 py-2 text-base shadow-lg border border-primary-200',
                  {
                    bottom: 'mt-1',
                    top: 'bottom-full mb-1',
                  }[placement]
                )}
              >
                {items.map((x) => (
                  <HeadlessUiListbox.Option
                    key={x.id}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-default select-none py-2 pl-2 pr-6',
                        {
                          'bg-accent-500 text-primary-50': active,
                        }
                      )
                    }
                    value={x}
                  >
                    {({ selected, active }) => {
                      return (
                        <>
                          <span
                            className={clsx(
                              'block truncate',
                              selected && 'font-bold'
                            )}
                          >
                            {render(x)}
                          </span>

                          {selected ? (
                            <span
                              className={clsx(
                                'absolute inset-y-0 right-2 flex items-center',
                                { 'text-primary-50': active }
                              )}
                            >
                              <CheckIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </HeadlessUiListbox.Option>
                ))}
              </HeadlessUiListbox.Options>
            </Transition>
          </div>
        </>
      )}
    </HeadlessUiListbox>
  );
}
