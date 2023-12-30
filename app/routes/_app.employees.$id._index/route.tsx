import Button from '@components/Button';
import { CalendarIcon, PencilIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';
import { Gender, type Employee, type EmployeePosition } from '@lib/models/employee';
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
import type { User } from '@lib/models/user';
import { toImage } from '@lib/utils/asset.server';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { ar1X1 } from '@cloudinary/url-gen/qualifiers/aspectRatio';
import { dpr } from '@cloudinary/url-gen/actions/delivery';
import type { Leave } from '@lib/models/leave';
import AsyncStatisticCard from './AsyncStatisticCard';
import Avatar from '@components/Avatar';
import Statistic from '@components/Statistic';
import { formatDate } from '@lib/utils/date';
import Section from './Section';
import Link from '@components/Link';

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

  const leavePromise = api.get(`leaves?issuerId=${id}`).match(
    (x) => (x.ok ? x.json() : null),
    () => null
  ) as Promise<Leave | null>;
  const userPromise = api.get(`users/${id}`).match(
    (x) =>
      x.ok
        ? (x.json() as Promise<User>).then((x) => ({
            ...x,
            avatar: x.avatar
              ? toImage(x.avatar)
                  .resize(fill().aspectRatio(ar1X1()))
                  .resize(scale(256, 256))
                  .delivery(dpr('auto'))
                  .format('auto')
                  .quality('auto')
                  .toURL()
              : undefined,
          }))
        : null,
    () => null
  );
  const positionsPromise = api
    .get(`employees/${id}/positions?includeDepartment=true&includeDepartmentPosition=true`)
    .match(
      (x) => (x.ok ? x.json() : paginated()),
      () => paginated()
    ) as Promise<Paginated<EmployeePosition>>;

  return defer({
    employee,
    id,
    userPromise,
    positionsPromise,
    leavePromise,
  });
}

export default function Route() {
  const { employee, id, positionsPromise, userPromise, leavePromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('employees.$id');

  return (
    <>
      <div className="space-y-8">
        <div className="flex gap-2 items-center justify-center">
          <Suspense
            fallback={
              <Avatar fallbackConfig={{ sex: employee.gender === Gender.Male ? 'man' : 'woman' }} className="w-24" />
            }
          >
            <Await resolve={userPromise}>
              {(x) => (
                <Avatar
                  src={x?.avatar}
                  fallbackConfig={{ sex: employee.gender === Gender.Male ? 'man' : 'woman' }}
                  className="w-24"
                />
              )}
            </Await>
          </Suspense>
          <h1 className="font-bold">
            {employee.firstName} {employee.lastName}
          </h1>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4">
          <AsyncStatisticCard
            resolve={positionsPromise.then((x) => x.totalCount)}
            label="Total positions"
            icon={<StarIcon className="w-10 h-10" />}
            className="text-info-500 bg-info-50"
          />
          <AsyncStatisticCard
            resolve={leavePromise.then((x) => x?.usedHours ?? 0)}
            label="Leave hours"
            icon={<CalendarIcon className="w-10 h-10" />}
            className="text-info-500 bg-info-50"
          />
        </div>
        <Section>
          <div className="flex gap-4 items-center justify-between mb-4">
            <h2>Personal Information</h2>
            <Link
              href={`/employees/${id}/edit`}
              className="flex px-1 gap-2 items-center rounded text-info-500 hover:bg-info-100 transition"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4 mt-4">
            <Statistic label="First name">{employee.firstName}</Statistic>
            <Statistic label="Last name">{employee.lastName}</Statistic>
            <Statistic label="Gender">{formatGender(employee.gender)}</Statistic>
            <Statistic label="Date of birth">{formatDate(new Date(employee.dateOfBirth))}</Statistic>
            <Suspense>
              <Await resolve={userPromise}>
                {(x) => (x ? <Statistic label="Email address">{x?.email}</Statistic> : null)}
              </Await>
            </Suspense>
          </div>
        </Section>
        <Section>
          <div className="flex gap-4 items-center justify-between mb-4">
            <h2>Position</h2>
            <Link
              href={`/employees/${id}/positions/new`}
              className="flex px-1 gap-2 items-center rounded text-info-500 hover:bg-info-100 transition font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New position</span>
            </Link>
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
        </Section>
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
