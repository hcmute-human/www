import Button from '@components/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Employee, EmployeePosition } from '@lib/models/employee';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, formatGender } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import PositionCard from './PositionCard';

export const handle = {
  i18n: 'employees.$id',
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const employee = (await api.get(`employees/${id}`).match(
    (x) => (x.ok ? x.json() : null),
    () => null
  )) as Employee | null;
  if (!employee) {
    throw redirect('/employees');
  }

  const positionsPromise = api
    .get(`employees/${id}/positions?includeDepartment=true&includeDepartmentPosition=true`)
    .match(
      (x) => (x.ok ? x.json() : paginated()),
      () => paginated()
    ) as Promise<Paginated<EmployeePosition>>;

  return defer({
    employee,
    id,
    positionsPromise,
  });
}

export default function Route() {
  const { employee, id, positionsPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('employees.$id');

  return (
    <>
      <div className="space-y-12">
        <div className="flex gap-4 items-center">
          <div className="border border-primary-200 aspect-square w-24 rounded-full" />
          <div>
            <h1>
              <span>
                {employee.firstName} {employee.lastName}
              </span>
            </h1>
            <p>Gender: {formatGender(employee.gender)}</p>
            <p>Born in {Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(employee.dateOfBirth))}.</p>
          </div>
        </div>
        <div>
          <div className="flex gap-4 items-center justify-between mb-4">
            <h2>Positions</h2>
            <Button as="link" href={`/employees/${id}/positions/new`} className="flex gap-1 items-center">
              <PlusIcon className="w-5 h-5" />
              <span>New position</span>
            </Button>
          </div>
          <Suspense fallback={'Loading...'}>
            <Await resolve={positionsPromise}>
              {(x) =>
                x.items.length ? (
                  <ul className="grid grid-cols-[repeat(auto-fill,_minmax(28rem,1fr))] gap-4">
                    {x.items.map((x) => (
                      <PositionCard key={x.departmentPositionId} position={x} />
                    ))}
                  </ul>
                ) : (
                  <span className="text-primary-500">No positions yet.</span>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await SessionApiClient.from(session).delete(
      `employees/${formData.get('employeeId')}/positions/${formData.get('departmentPositionId')}`
    );
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
