import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Column from '@components/Column';
import { Listbox } from '@components/Listbox';
import { PaginationBar } from '@components/PaginationBar';
import Row from '@components/Row';
import Table from '@components/Table';
import TableBody from '@components/TableBody';
import TableHeader from '@components/TableHeader';
import UncontrolledTextField from '@components/UncontrolledTextField';
import { ArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useDebounceSubmit } from '@lib/hooks/debounceSubmit';
import { useSearchParamsOr } from '@lib/hooks/searchParams';
import type { LeaveApplication } from '@lib/models/leave';
import type { Paginated } from '@lib/models/paginated';
import { fuzzyFilter, fuzzySort } from '@lib/utils';
import { Form, useAsyncValue, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import LeaveApplicationRow from './LeaveApplicationRow';
import type { LoaderResponse } from './route';

const columnHelper = createColumnHelper<LeaveApplication>();

const sizes = [
  { key: 1, value: 5 },
  { key: 2, value: 10 },
  { key: 3, value: 20 },
  { key: 4, value: 50 },
  { key: 5, value: 100 },
];

export default function LeaveApplicationTable() {
  const { t } = useTranslation('leaves');
  const { totalCount, items } = useAsyncValue() as Paginated<LeaveApplication>;
  const { canProcess, canDelete } = useLoaderData<LoaderResponse>();
  const [searchParams] = useSearchParams();
  const [{ name, size }] = useSearchParamsOr({ name: '', size: 10 });
  const { state } = useNavigation();
  const submitting = state === 'submitting';
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
            checkboxClassName="mt-2 bg-primary-0"
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={(x) => table.toggleAllRowsSelected(x)}
          />
        ),
      }),
      columnHelper.accessor(({ issuer: { firstName, lastName } = {} }) => `${firstName} ${lastName}`, {
        header: t('table.header.issuer'),
        id: 'issuerName',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor('leaveType.name', {
        header: t('table.header.leaveType'),
        id: 'leaveTypeName',
        enableSorting: true,
        enableColumnFilter: false,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor(({ startTime }) => new Date(startTime), {
        id: 'startTime',
        header: t('table.header.startTime'),
        enableColumnFilter: false,
      }),
      columnHelper.accessor(({ endTime }) => new Date(endTime), {
        id: 'endTime',
        header: t('table.header.endTime'),
        enableColumnFilter: false,
      }),
      columnHelper.accessor('status', {
        header: t('table.header.status'),
        enableColumnFilter: false,
      }),
      columnHelper.accessor('description', {
        header: t('table.header.description'),
        enableColumnFilter: false,
      }),
      columnHelper.accessor('createdTime', {
        header: t('table.header.createdTime'),
        enableSorting: true,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: 'actions',
        header: t('table.header.actions'),
      }),
    ],
    [t]
  );
  const table = useReactTable({
    data: items,
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
        searchParams.set('order', sorts.map((x) => (x.desc ? '-' : '') + x.id).join(','));
      }
      submit(searchParams, { replace: true });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const [selectedSize, setSelectedSize] = useState(sizes.find(({ value }) => value === size) ?? sizes[1]);

  return (
    <>
      <div className="max-h-[32rem] overflow-y-auto mt-4">
        <Table
          className={clsx('w-full table-auto', {
            'animate-twPulse pointer-events-none': submitting,
          })}
        >
          <TableHeader className="text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <Row key={headerGroup.id} className="align-top">
                {headerGroup.headers.map(({ id, column, isPlaceholder, getContext }) => (
                  <Column
                    key={id}
                    className={clsx({
                      'w-0': id === 'select',
                      'hidden xl:table-cell': id === 'createdTime',
                      'hidden 2xl:table-cell': id === 'description',
                    })}
                  >
                    <div className="xl:flex flex-wrap items-center gap-x-8 w-full">
                      <div
                        className={clsx('flex gap-2 items-center', {
                          'cursor-pointer select-none': column.getCanSort(),
                        })}
                        onClick={column.getToggleSortingHandler()}
                      >
                        <span>{isPlaceholder ? null : flexRender(column.columnDef.header, getContext())}</span>
                        {column.getCanSort() ? (
                          column.getIsSorted() ? (
                            <ArrowUpIcon
                              className={clsx(
                                'w-4 h-4 transition-transform ease-in-out',
                                column.getIsSorted() === 'desc' && 'rotate-180'
                              )}
                            />
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-primary-300" />
                          )
                        ) : null}
                      </div>
                      {column.getCanFilter() ? (
                        <UncontrolledTextField
                          type="text"
                          id={column.id}
                          name={column.id}
                          inputClassName="max-w-[32ch] w-full text-sm font-normal"
                          defaultValue={name}
                          onChange={(value) => {
                            column.setFilterValue(value);
                            searchParams.set(column.id, value);
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
            {table.getRowModel().rows.length === 0 ? (
              <Row>
                <Cell colSpan={100}>{t('table.body.empty')}.</Cell>
              </Row>
            ) : (
              table
                .getRowModel()
                .rows.map((row) => (
                  <LeaveApplicationRow key={row.original.id} row={row} canProcess={canProcess} canDelete={canDelete} />
                ))
            )}
          </TableBody>
        </Table>
      </div>
      <div
        className={clsx('flex justify-between gap-8 mt-4 items-center', {
          'animate-twPulse pointer-events-none': submitting,
        })}
      >
        <div className="flex gap-2 items-center min-w-max">
          <Trans
            i18nKey="displaySize"
            defaults="Displaying <select></select> out of {{totalCount}} leave applications."
            t={t}
            values={{ totalCount }}
            components={{
              select: (
                <Listbox
                  items={sizes}
                  value={selectedSize}
                  onChange={(x) => {
                    setSelectedSize(x);
                    searchParams.set('size', x.value + '');
                    submit(searchParams, { replace: true });
                  }}
                  placement="top"
                  render={({ value }) => value}
                  className="w-16"
                />
              ),
            }}
          />
        </div>
        <Form method="get" preventScrollReset>
          <PaginationBar totalCount={totalCount} />
        </Form>
      </div>
    </>
  );
}
