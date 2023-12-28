import Button from '@components/Button';
import Cell from '@components/Cell';
import Checkbox from '@components/Checkbox';
import Popover from '@components/Popover';
import Row from '@components/Row';
import TextLink from '@components/TextLink';
import { CheckIcon, InformationCircleIcon, TrashIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatLeaveApplicationStatus, LeaveApplicationStatus, type LeaveApplication } from '@lib/models/leave';
import { formatDate, formatRelativeTimeFromNow } from '@lib/utils/date';
import { useFetcher } from '@remix-run/react';
import type { Row as TRow } from '@tanstack/react-table';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import type { action } from './route';
import UncontrolledSelectField from '@components/UncontrolledSelectField';
import ListBoxItem from '@components/ListBoxItem';
import InlineAlert from '@components/InlineAlert';
import Badge from '@components/Badge';

interface Props {
  row: TRow<LeaveApplication>;
  canProcess: boolean;
  canDelete: boolean;
}

const statuses = [
  {
    text: 'Pending',
    value: LeaveApplicationStatus.Pending,
  },
  {
    text: 'Approved',
    value: LeaveApplicationStatus.Approved,
  },
  {
    text: 'Rejected',
    value: LeaveApplicationStatus.Rejected,
  },
];

export default function LeaveApplicationRow({ row, canProcess, canDelete }: Props) {
  const { t } = useTranslation('leaves');
  const { Form, formData, data, submit } = useFetcher<typeof action>();
  const isDeleting =
    formData?.get('id') === row.original.id ||
    (data?.ok === true && data._action === 'delete' && data.id === row.original.id);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const hasError = data?.ok === false && data.id === row.original.id;

  function ActionError() {
    if (!hasError) {
      return null;
    }
    if (data._action === 'delete') {
      return (
        <Badge variant="negative" size="xs" className="ml-2">
          {t('deletionFailed')}
        </Badge>
      );
    }
    if (data._action === 'patch') {
      return (
        <Badge variant="negative" size="xs" className="ml-2">
          {t('updateFailed')}
        </Badge>
      );
    }
    return null;
  }

  return (
    <Row className={clsx(isDeleting && 'hidden')}>
      <Cell key="select">
        <Checkbox isSelected={row.getIsSelected()} onChange={(x) => row.toggleSelected(x)} aria-label="Select" />
      </Cell>
      <Cell key="issuerName">
        <TextLink href={`/employees/${row.original.issuerId}`}>{row.getValue<string>('issuerName')}</TextLink>
        <ActionError />
      </Cell>
      <Cell key="leaveTypeName">{row.getValue<string>('leaveTypeName')}</Cell>
      <Cell key="startTime">{formatDate(row.getValue<Date>('startTime'))}</Cell>
      <Cell key="endTime">{formatDate(row.getValue<Date>('endTime'))}</Cell>
      <Cell key="status">
        {canProcess ? (
          <UncontrolledSelectField
            name="status"
            items={statuses}
            defaultSelectedKey={row.getValue('status')}
            placeholder="None"
            className="min-w-[8rem]"
            onSelectionChange={(key) => {
              submit(
                { _action: 'status', status: key, id: row.original.id },
                { method: 'patch', navigate: false, encType: 'application/json' }
              );
            }}
          >
            {({ text, value }) => (
              <ListBoxItem className="flex justify-between" key={value} id={value} textValue={text}>
                {({ isSelected }) => (
                  <>
                    <span
                      className={clsx(
                        'group-hover:text-inherit',
                        (
                          {
                            [LeaveApplicationStatus.Pending]: 'text-info-500',
                            [LeaveApplicationStatus.Approved]: 'text-positive-500',
                            [LeaveApplicationStatus.Rejected]: 'text-negative-500',
                          } as Record<number, string>
                        )[value]
                      )}
                    >
                      {text}
                    </span>
                    {isSelected ? <CheckIcon className="text-accent-500 w-4 h-4 group-hover:text-inherit" /> : null}
                  </>
                )}
              </ListBoxItem>
            )}
          </UncontrolledSelectField>
        ) : (
          formatLeaveApplicationStatus(row.getValue<number>('status'))
        )}
      </Cell>
      <Cell key="description" className="hidden 2xl:table-cell max-w-[20ch]">
        {row.getValue<string>('description')}
      </Cell>
      <Cell key="createdTime" className="hidden xl:table-cell">
        {formatRelativeTimeFromNow(new Date(row.getValue<string>('createdTime')))}
      </Cell>
      <Cell key="actions">
        <div className="flex items-center gap-2 w-max">
          <Button as="link" href={`/leaves/${row.original.id}`} size="sm" aria-label={t('table.body.actions.details')}>
            <InformationCircleIcon className="w-5 h-5" />
          </Button>
          {canDelete ? (
            <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
              <Button
                ref={triggerRef}
                type="button"
                variant="negative"
                size="sm"
                aria-label={t('table.body.actions.delete')}
                onPress={() => setIsOpen(true)}
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
              <Popover>
                <Dialog className="p-4 outline-none">
                  <Form method="delete" className="space-y-2">
                    <input type="hidden" name="id" value={row.original.id} />
                    <p>{t('confirmDeletion')}</p>
                    <div className="flex gap-2 justify-between">
                      <Button
                        type="submit"
                        variant="negative"
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
                  </Form>
                </Dialog>
              </Popover>
            </DialogTrigger>
          ) : null}
        </div>
      </Cell>
    </Row>
  );
}
