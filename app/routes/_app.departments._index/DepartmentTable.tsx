import Button from '@components/Button';
import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Column from '@components/Column';
import { PaginationBar } from '@components/PaginationBar';
import Row from '@components/Row';
import Table from '@components/Table';
import TableBody from '@components/TableBody';
import TableHeader from '@components/TableHeader';
import UncontrolledTextField from '@components/UncontrolledTextField';
import { Listbox, Transition, type ListboxProps } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { useDebounceSubmit } from '@lib/hooks/debounceSubmit';
import { useSearchParamsOr } from '@lib/hooks/searchParams';
import type { Department } from '@lib/models/department';
import { fuzzyFilter, fuzzySort } from '@lib/utils';
import {
  Form,
  useAsyncValue,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { type RankingInfo } from '@tanstack/match-sorter-utils';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { Fragment, useMemo, useState, type Key, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { GetDepartmentsResult } from './types';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzyFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const columnHelper = createColumnHelper<Department>();

const sizes = [
  { id: 1, value: 5 },
  { id: 2, value: 10 },
  { id: 3, value: 20 },
  { id: 4, value: 50 },
  { id: 5, value: 100 },
];

function MyListbox<TType extends { id: Key }, TActualType>({
  items,
  render,
  ...props
}: Omit<ListboxProps<'div', TType, TActualType>, 'value' | 'onChange'> & {
  items: TType[];
  value?: TType;
  onChange?(value: TType): void;
  render(value: TType): ReactNode;
}) {
  return (
    <Listbox<'div', TType, TActualType> {...props}>
      {({ open, value }) => (
        <>
          <div className="relative max-w-[16ch]">
            <Listbox.Button className="leading-none relative w-full cursor-default rounded-md bg-primary-0 py-2 pl-2 pr-6 text-left shadow-sm border border-primary-200 rac-focus-visible:outline-focus">
              <span className="block truncate">{render(value)}</span>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <ChevronUpDownIcon
                  className="h-4 w-4 text-primary-300"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition transform ease-in-out"
              enterFrom="-translate-y-2 opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0 -translate-y-2"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-primary-0 py-2 text-base shadow-lg border border-primary-200">
                {items.map((x) => (
                  <Listbox.Option
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
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
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
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

export default function DepartmentTable() {
  const [t] = useTranslation('departments');
  const { totalCount, items } = useAsyncValue() as GetDepartmentsResult;
  const [searchParams] = useSearchParams();
  const [{ name, size }] = useSearchParamsOr({ name: '', size: 10 });
  const { state } = useNavigation();
  const sortedDepartments = items;
  const submit = useDebounceSubmit(100);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checkboxClassName="mt-2 lg:mt-0"
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={(x) => table.toggleAllRowsSelected(x)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            isSelected={row.getIsSelected()}
            onChange={(x) => row.toggleSelected(x)}
          />
        ),
      }),
      columnHelper.accessor('name', {
        header: t('table.header.name'),
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor('id', {
        header: t('table.header.id'),
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      }),
      columnHelper.accessor('createdTime', {
        header: t('table.header.createdTime'),
        cell: (info) =>
          Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(info.getValue())),
        enableSorting: true,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: 'actions',
        header: t('table.header.actions'),
        cell: (info) => (
          <div className="flex items-stretch gap-2 w-max">
            <Button
              as="link"
              href={`/departments/${info.row.getValue<string>('id')}`}
              size="sm"
              aria-label={t('table.body.actions.details')}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </Button>
            <Button
              as="link"
              variant="negative"
              href={`/departments/${info.row.getValue<string>('id')}`}
              size="sm"
              aria-label={t('table.body.actions.delete')}
            >
              <XCircleIcon className="w-5 h-5" />
            </Button>
          </div>
        ),
      }),
    ],
    [t]
  );
  const table = useReactTable({
    data: sortedDepartments,
    columns,
    filterFns: {
      fuzzyFilter,
    },
    state: {
      columnFilters,
      rowSelection,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (x) => {
      const sorts = typeof x === 'function' ? x(sorting) : x;
      setSorting(sorts);
      if (!sorts.length) {
        searchParams.delete('order');
      } else {
        searchParams.set(
          'order',
          sorts.map((x) => (x.desc ? '-' : '') + x.id).join(',')
        );
      }
      submit(searchParams, { replace: true });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const [selectedSize, setSelectedSize] = useState(
    sizes.find(({ value }) => value === size) ?? sizes[1]
  );

  return (
    <>
      <MyListbox
        items={sizes}
        value={selectedSize}
        onChange={(x) => {
          setSelectedSize(x);
          searchParams.set('size', x.value + '');
          submit(searchParams, { replace: true });
        }}
        render={(x) => `Show ${x.value}`}
      />
      <Table
        className={clsx('w-full table-auto mt-4', {
          'animate-pulse pointer-events-none': state === 'loading',
        })}
      >
        <TableHeader className="text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <Row key={headerGroup.id} className="align-top lg:align-middle">
              {headerGroup.headers.map((header) => (
                <Column
                  key={header.id}
                  className={clsx({
                    'w-0': header.id === 'select',
                    'hidden lg:table-cell': header.id === 'id',
                  })}
                >
                  <div className="lg:flex items-center gap-8 w-full">
                    <div
                      className={clsx('flex gap-2', {
                        'cursor-pointer select-none':
                          header.column.getCanSort(),
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <UncontrolledTextField
                        type="text"
                        id={header.column.id}
                        name={header.column.id}
                        inputClassName="max-w-[32ch] w-full text-sm font-normal"
                        defaultValue={name}
                        onChange={(value) => {
                          header.column.setFilterValue(value);
                          searchParams.set(header.column.id, value);
                          submit(searchParams, { replace: true });
                        }}
                      />
                    ) : null}
                  </div>
                </Column>
              ))}
            </Row>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <Row
              key={row.id}
              className={clsx(
                'transition-[background-color_outline] duration-75 ease-in-out hover:bg-primary-50 focus-within:outline-focus-within',
                {
                  'bg-primary-50': row.getIsSelected(),
                }
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <Cell
                  key={cell.id}
                  className={clsx({
                    'hidden lg:table-cell': cell.column.id === 'id',
                  })}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          ))}
        </TableBody>
        {/* <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </Table>
      <Form
        method="get"
        preventScrollReset
        className={clsx('mt-4', {
          'animate-pulse pointer-events-none': state === 'loading',
        })}
      >
        <PaginationBar totalCount={totalCount} />
      </Form>
    </>
  );
}
