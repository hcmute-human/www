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
import { ArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/20/solid';
import { useDebounceSubmit } from '@lib/hooks/debounceSubmit';
import { useSearchParamsOr } from '@lib/hooks/searchParams';
import type { Job } from '@lib/models/job';
import type { Paginated } from '@lib/models/paginated';
import { fuzzyFilter, fuzzySort } from '@lib/utils';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { Form, useAsyncValue, useNavigation, useSearchParams } from '@remix-run/react';
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
import JobRow from './JobRow';

const columnHelper = createColumnHelper<Job>();

const sizes = [
  { key: 1, value: 5 },
  { key: 2, value: 10 },
  { key: 3, value: 20 },
  { key: 4, value: 50 },
  { key: 5, value: 100 },
];

export default function JobTable() {
  const [t] = useTranslation('jobs');
  const { totalCount, items } = useAsyncValue() as Paginated<Job>;
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
            checkboxClassName="mt-2 lg:mt-0 bg-primary-0"
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={(x) => table.toggleAllRowsSelected(x)}
          />
        ),
      }),
      columnHelper.accessor('title', {
        header: t('table.header.title'),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor((x) => x.position.department.name, {
        id: 'departmentName',
        header: t('table.header.departmentName'),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor((x) => x.position.name, {
        id: 'positionName',
        header: t('table.header.positionName'),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'fuzzyFilter',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor('id', {
        header: t('table.header.id'),
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
              <Row key={headerGroup.id} className="align-top xl:align-middle">
                {headerGroup.headers.map((header) => (
                  <Column
                    key={header.id}
                    className={clsx({
                      'w-0': header.id === 'select',
                      'hidden lg:table-cell': header.id === 'id',
                      'hidden md:table-cell': header.id === 'createdTime',
                    })}
                  >
                    <div className="xl:flex items-center gap-8 w-full">
                      <div
                        className={clsx('flex gap-2 items-center', {
                          'cursor-pointer select-none': header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() ? (
                            <ArrowUpIcon
                              className={clsx(
                                'w-4 h-4 transition-transform ease-in-out',
                                header.column.getIsSorted() === 'desc' && 'rotate-180'
                              )}
                            />
                          ) : (
                            <ArrowsUpDownIcon className="w-4 h-4 text-primary-300" />
                          )
                        ) : null}
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
            {table.getRowModel().rows.length === 0 ? (
              <Row>
                <Cell colSpan={100}>{t('table.body.empty')}.</Cell>
              </Row>
            ) : (
              table.getRowModel().rows.map((row) => <JobRow row={row} key={row.getValue<string>('id')} />)
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
            defaults="Displaying <select></select> out of {{totalCount}} jobs."
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
