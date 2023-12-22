import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import type { LeaveApplication } from '@lib/models/leave';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { fail, ok, unauthorized, type ActionOkResponse, type ActionErrorResponse } from '@lib/utils/action.server';
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
import LeaveApplicationTable from './LeaveApplicationTable';

export const handle = {
  i18n: 'leaves',
};

export type LoaderResponse = typeof loader;
export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-startTime',
      includeIssuer: 'true',
      includeLeaveType: 'true',
    })
  );

  const api = SessionApiClient.from(session);

  const leaveApplicationsPromise = api.get(`leave-applications?${params.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveApplication>>;
  const [title, canProcess, canDelete] = await Promise.all([
    i18next.getFixedT(request, 'leaves').then((t) => t('meta.title')),
    api.exists(`user-permissions/process:leaveApplication`),
    api.exists(`user-permissions/delete:leaveApplication`),
  ]);

  return defer({
    title,
    canProcess,
    canDelete,
    leaveApplicationsPromise,
  });
}

export default function Route() {
  const { leaveApplicationsPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('leaves');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/leaves/new" className="w-fit flex gap-2 items-center">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">{t('applyLeave')}</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={leaveApplicationsPromise}>
          <LeaveApplicationTable />
        </Await>
      </Suspense>
    </>
  );
}

type ActionResponsePayload = { id: string; _action?: 'delete' | 'patch' };
type ActionResponse = ActionOkResponse<ActionResponsePayload> | ActionErrorResponse<ActionResponsePayload> | null;
export async function action({
  request,
  context: { session },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  switch (request.method.toLocaleLowerCase()) {
    case 'patch': {
      const api = SessionApiClient.from(session);
      const data = (await request.json()) as LeaveApplication;
      const id = data.id;
      const result = await api.patch(`leave-applications/${id}`, {
        body: {
          patch: [{ op: 'replace', path: '/status', value: data.status }],
        },
      });
      if (result.isErr()) {
        return json(
          fail(await toActionErrorsAsync(result.error), {
            id,
            _action: 'patch' as const,
          })
        );
      }
      return json(ok({ id, _action: 'patch' as const }));
    }
    case 'delete': {
      const api = SessionApiClient.from(session);
      const formData = await request.formData();
      const id = formData.get('id') as string | null;
      if (!id) {
        return json(null);
      }
      const result = await api.delete(`leave-applications/${id}`);
      if (result.isErr()) {
        return json(
          fail(await toActionErrorsAsync(result.error), {
            id,
            _action: 'delete' as const,
          })
        );
      }
      return json(ok({ id, _action: 'delete' as const }));
    }
  }

  return json(null);
}
