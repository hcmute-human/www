import Badge from '@components/Badge';
import Button from '@components/Button';
import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Popover from '@components/Popover';
import Row from '@components/Row';
import { PencilSquareIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { type Job } from '@lib/models/job';
import { formatDate, formatRelativeTimeFromNow } from '@lib/utils/date';
import { useFetcher } from '@remix-run/react';
import type { Row as TRow } from '@tanstack/react-table';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import type { action } from './route';
import TextLink from '@components/TextLink';

interface Props {
  row: TRow<Job>;
}

export default function JobRow({ row }: Props) {
  const { t } = useTranslation('jobs');
  const id = row.getValue<string>('id');
  const fetcher = useFetcher<typeof action>();
  const isDeleting = fetcher.formData?.get('id') === id;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const isDeletionFailed = fetcher.data?.ok === false && fetcher.data.id === id;

  return (
    <Row className={clsx(isDeleting && 'hidden')}>
      <Cell>
        <Checkbox isSelected={row.getIsSelected()} onChange={(x) => row.toggleSelected(x)} aria-label="Select" />
      </Cell>
      <Cell>
        <TextLink href={`/jobs/${row.original.id}`}>{row.getValue<string>('title')}</TextLink>
        {isDeletionFailed ? (
          <Badge variant="negative" size="xs" className="ml-2">
            {t('deletionFailed')}
          </Badge>
        ) : null}
      </Cell>
      <Cell>{row.getValue<string>('departmentName')}</Cell>
      <Cell>{row.getValue<string>('positionName')}</Cell>
      <Cell className="hidden lg:table-cell">{id}</Cell>
      <Cell className="hidden md:table-cell">
        {formatRelativeTimeFromNow(new Date(row.getValue<string>('createdTime')))}
      </Cell>
      <Cell>
        <div className="flex items-center gap-2 w-max">
          <Button
            as="link"
            variant="info"
            href={`/leaves/jobs/${id}/edit`}
            size="sm"
            aria-label={t('table.body.actions.edit')}
          >
            <PencilSquareIcon className="w-5 h-5" />
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
                  <input type="hidden" name="id" value={id} />
                  <p>{t('confirmDeletion')}</p>
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
                      {t('table.body.actions.cancel')}
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
