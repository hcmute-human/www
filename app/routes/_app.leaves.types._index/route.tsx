import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { pageable, searchParams } from '@lib/utils/searchParams.server';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type TypedResponse,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import LeaveApplicationTable from './LeaveTypeTable';
import type { LeaveApplication } from '@lib/models/leave';

export const handle = {
  i18n: 'leaves.types',
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-createdTime',
    })
  );

  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['read:leaveType'] }))) {
    throw redirect('/');
  }

  const leaveTypesPromise = api.get(`leave-types?${params.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveApplication>>;
  const title = await i18next.getFixedT(request, 'leaves.types').then((t) => t('meta.title'));

  return defer({
    title,
    leaveTypesPromise,
  });
}

export default function Route() {
  const { leaveTypesPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('leaves.types');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/leaves/types/new" className="w-fit flex gap-2 items-center">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">{t('createLeaveType')}</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={leaveTypesPromise}>
          <LeaveApplicationTable />
        </Await>
      </Suspense>
    </>
  );
}

type ActionResponse = { ok: false; error: ActionError; id: string } | { ok: true } | null;
export async function action({
  request,
  context: { session },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  const api = SessionApiClient.from(session);
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await api.delete(`leave-types/${formData.get('id')}`);
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
        id: formData.get('id') as string,
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
