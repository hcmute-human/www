import Button from '@components/Button';
import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Popover from '@components/Popover';
import Row from '@components/Row';
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import type { Department } from '@lib/models/department';
import { formatRelativeTimeFromNow } from '@lib/utils/date';
import { useFetcher } from '@remix-run/react';
import type { Row as TRow } from '@tanstack/react-table';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

interface Props {
  row: TRow<Department>;
}

export default function DepartmentRow({ row }: Props) {
  const { t } = useTranslation('departments');
  const fetcher = useFetcher<any>();
  const isDeleting = fetcher.formData?.get('id') === row.getValue<string>('id');
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Row className={clsx(isDeleting && 'hidden')}>
      <Cell key="select">
        <Checkbox isSelected={row.getIsSelected()} onChange={(x) => row.toggleSelected(x)} aria-label="Select" />
      </Cell>
      <Cell key="name">
        <span>{row.getValue<string>('name')}</span>
        {fetcher.data?.ok === false && fetcher.data.id === row.getValue<string>('id') ? (
          <span className="ml-2 px-1 font-bold text-xs text-primary-50 bg-negative-500 rounded">Unable to delete</span>
        ) : null}
      </Cell>
      <Cell key="id" className="hidden md:table-cell">
        {row.getValue<string>('id')}
      </Cell>
      <Cell key="createdTime" className="hidden sm:table-cell">
        {formatRelativeTimeFromNow(new Date(row.getValue<string>('createdTime')))}
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
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button
              ref={triggerRef}
              type="button"
              variant="negative"
              size="sm"
              aria-label={t('table.body.actions.delete')}
              onPress={() => setIsOpen(true)}
            >
              <XCircleIcon className="w-5 h-5" />
            </Button>
            <Popover>
              <Dialog className="p-4 outline-none">
                <fetcher.Form method="post" className="space-y-2">
                  <input type="hidden" name="id" value={row.getValue<string>('id')} />
                  <p>Are you sure to delete this department?</p>
                  <div className="flex gap-2 justify-between">
                    <Button
                      type="submit"
                      variant="negative"
                      name="_action"
                      value="delete"
                      onPress={(e) => {
                        setIsOpen(false);
                        e.continuePropagation();
                      }}
                    >
                      {t('table.body.actions.delete')}
                    </Button>
                    <Button form="deleteForm" type="button" variant="primary" onPress={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </fetcher.Form>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      </Cell>
    </Row>
  );
}
