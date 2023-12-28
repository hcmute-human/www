import { CalendarDaysIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { DepartmentPosition } from '@lib/models/department';
import type { Employee } from '@lib/models/employee';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle } from '@lib/utils';
import { defer, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import AsyncStatisticCard from './AsyncStatisticCard';
import EmployeeTable from '../_app.employees._index/EmployeeTable';
import { Suspense } from 'react';

export const handle = {
  i18n: 'departments.$id',
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ context: { session }, params }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const departmentPositionsPromise = api.get(`departments/${params.id}/positions`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<DepartmentPosition>>;
  const employeesPromise = api.get(`employees?departmentId=${params.id}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<Employee>>;
  const leavesCountPromise = api.count(`leave-applications?countOnly=true&departmentId=${params.id}`).match(
    (x) => x,
    () => 0
  );
  // const leavesCountPromise = new Promise<number>((resolve) =>
  //   setTimeout(() => {
  //     resolve(Math.floor(Math.random() * 20 + 5));
  //   }, 100)
  // );

  return defer({
    departmentPositionsPromise,
    employeesPromise,
    leavesCountPromise,
    title: 'General',
  });
}

export default function Route() {
  const { departmentPositionsPromise, employeesPromise, leavesCountPromise } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Overview</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 mt-2">
        <AsyncStatisticCard
          label="Total employees"
          resolve={employeesPromise.then((x) => x.totalCount)}
          icon={<UserGroupIcon className="w-10 h-10" />}
          className="text-info-500 bg-info-50"
        />
        <AsyncStatisticCard
          label="Total positions"
          resolve={departmentPositionsPromise.then((x) => x.totalCount)}
          icon={<StarIcon className="w-10 h-10" />}
          className="text-info-500 bg-info-50"
        />
        <AsyncStatisticCard
          label="Total leaves"
          resolve={leavesCountPromise}
          icon={<CalendarDaysIcon className="w-10 h-10" />}
          className="text-info-500 bg-info-50"
        />
      </div>
      <h2 className="mt-8">Employees</h2>
      <Suspense>
        <Await resolve={employeesPromise}>
          <EmployeeTable />
        </Await>
      </Suspense>
    </>
  );
}
