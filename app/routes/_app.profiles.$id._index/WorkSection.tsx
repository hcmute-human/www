import type { Employee, EmployeePosition } from '@lib/models/employee';
import type { Paginated } from '@lib/models/paginated';
import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import PositionCard from '../_app.employees.$id._index/PositionCard';

interface Props {
  employee: Employee;
  positionsPromise: Promise<Paginated<EmployeePosition>>;
}

export default function EmployeeSection({ employee, positionsPromise }: Props) {
  return (
    <>
      {/* <table>
        <tbody>
          <tr className="align-top">
            <td className="pr-2">Email:</td>
            <td>{employee.gender}</td>
          </tr>
        </tbody>
      </table> */}
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
    </>
  );
}
