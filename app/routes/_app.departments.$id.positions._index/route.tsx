import Button from '@components/Button';
import i18next from '@lib/i18n/index.server';
import { paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { defer, json, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Await, useLoaderData, useParams } from '@remix-run/react';
import { Suspense } from 'react';
import PositionTable from './PositionTable';
import type { GetDepartmentPositionResult } from './types';
import { pageable, searchParams } from '@lib/utils/searchParams.server';

export const handle = {
  i18n: 'departments.$id.positions',
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, context: { session }, params }: LoaderFunctionArgs) {
  const queryParams = pageable(
    searchParams(request, {
      order: '-createdTime',
    })
  );
  const api = SessionApiClient.from(session);
  const departmentPositionsPromise = api.get(`departments/${params.id}/positions?${queryParams.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<GetDepartmentPositionResult>;

  return defer({
    departmentPositionsPromise,
  });
}

export default function Route() {
  const { id } = useParams();
  const { departmentPositionsPromise } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h1>Positions</h1>
        <Button as="link" href={`/departments/${id}/positions/new`}>
          New position
        </Button>
      </div>
      <Suspense>
        <Await resolve={departmentPositionsPromise}>{() => <PositionTable />}</Await>
      </Suspense>
    </>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  const id = formData.get('id');
  if (!id) {
    return json(null);
  }
  if (formData.get('_action') === 'delete') {
    const result = await api.delete(`department-positions/${id}`);
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
        id,
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
