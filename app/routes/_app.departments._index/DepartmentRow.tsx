import Button from '@components/Button';
import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Row from '@components/Row';
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import type { Department } from '@lib/models/department';
import { formatRelativeTimeFromNow } from '@lib/utils/date';
import { useFetcher } from '@remix-run/react';
import type { Row as TRow } from '@tanstack/react-table';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface Props {
  row: TRow<Department>;
}

export default function DepartmentRow({ row }: Props) {
  const { t } = useTranslation('departments');
  const fetcher = useFetcher<any>();
  const isDeleting = fetcher.formData?.get('id') === row.getValue<string>('id');

  return (
    <Row className={clsx(isDeleting && 'hidden')}>
      <Cell key="select">
        <Checkbox
          isSelected={row.getIsSelected()}
          onChange={(x) => row.toggleSelected(x)}
          aria-label="Select"
        />
      </Cell>
      <Cell key="name">
        <span>{row.getValue<string>('name')}</span>
        {fetcher.data?.ok === false &&
        fetcher.data.id === row.getValue<string>('id') ? (
          <span className="ml-2 px-1 font-bold text-xs text-primary-50 bg-negative-500 rounded">
            Unable to delete
          </span>
        ) : null}
      </Cell>
      <Cell key="id" className="hidden lg:table-cell">
        {row.getValue<string>('id')}
      </Cell>
      <Cell key="createdTime">
        {/* {Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(row.getValue<string>('createdTime')))} */}
        {formatRelativeTimeFromNow(
          new Date(row.getValue<string>('createdTime'))
        )}
      </Cell>
      <Cell key="actions">
        <div className="flex items-center gap-2 w-max">
          <Button
            as="link"
            href={`/departments/${row.getValue<string>('id')}`}
            size="sm"
            aria-label={t('table.body.actions.details')}
          >
            <InformationCircleIcon className="w-5 h-5" />
          </Button>
          <fetcher.Form method="post" className="flex">
            <input type="hidden" name="id" value={row.getValue<string>('id')} />
            <Button
              type="submit"
              variant="negative"
              href={`/departments/${row.getValue<string>('id')}`}
              size="sm"
              aria-label={t('table.body.actions.delete')}
              name="_action"
              value="delete"
            >
              <XCircleIcon className="w-5 h-5" />
            </Button>
          </fetcher.Form>
        </div>
      </Cell>
    </Row>
  );
}
