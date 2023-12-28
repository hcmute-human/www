import Button from '@components/Button';
import Popover from '@components/Popover';
import TextLink from '@components/TextLink';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { EmployeePosition } from '@lib/models/employee';
import { formatEmploymentType } from '@lib/utils/employee';
import clsx from 'clsx';
import { useState } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { useFetcher } from 'react-router-dom';

interface Props {
  position: EmployeePosition;
}

function formatRange(start: Date, end: Date) {
  return Intl.DateTimeFormat('en', { dateStyle: 'long' }).formatRange(start, end);
}

export default function PositionCard({
  position: {
    departmentPosition: { department, ...departmentPosition },
    ...position
  },
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { formData, data, Form } = useFetcher();
  const isDeleting = formData?.get('departmentPositionId') === position.departmentPositionId;
  const error = isDeleting && data?.ok === false;
  return (
    <li
      className={clsx(
        'relative p-4 border rounded-lg',
        error ? 'border-negative-500' : 'border-primary-100',
        isDeleting && 'hidden'
      )}
    >
      <div className="flex justify-between gap-4 flex-wrap">
        <div className="grid content-between flex-grow">
          <h4 className="flex items-center gap-2">
            <TextLink href={`/departments/${department.id}`}>
              {department.name} - {departmentPosition.name}
            </TextLink>
          </h4>
          <p>{formatRange(new Date(position.startTime), new Date(position.endTime))}</p>
        </div>
        <div className="grid content-between text-right">
          <span>
            {Intl.NumberFormat('en', { style: 'currency', currency: 'VND', currencyDisplay: 'code' }).format(
              position.salary
            )}{' '}
            per month
          </span>
          <small className="text-primary-500">{formatEmploymentType(position.employmentType)}</small>
        </div>
        <div className="grid content-between gap-1">
          <Button
            as="link"
            href={`/employees/${position.employeeId}/positions/${position.departmentPositionId}/edit`}
            size="sm"
            variant="primary"
            outlined
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Button>
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button size="sm" type="button" variant="negative" outlined>
              <TrashIcon className="w-5 h-5" />
            </Button>
            <Popover>
              <Dialog className="p-4 outline-none">
                <Form
                  method="post"
                  className="space-y-2"
                  onSubmit={() => {
                    setIsOpen(false);
                  }}
                >
                  <input type="hidden" name="employeeId" value={position.employeeId} />
                  <input type="hidden" name="departmentPositionId" value={position.departmentPositionId} />
                  <p>Are you sure to delete employee's position?</p>
                  <div className="flex gap-2 justify-between">
                    <Button type="submit" variant="negative" name="_action" value="delete">
                      Delete
                    </Button>
                    <Button type="button" variant="primary" onPress={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      </div>
    </li>
  );
}
