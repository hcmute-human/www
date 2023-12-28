import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import i18next from '@lib/i18n/index.server';
import type { LeaveApplication } from '@lib/models/leave';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { fail, ok } from '@lib/utils/action.server';
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
import HolidayTable from './HolidayTable';

export const handle = {
  i18n: 'leaves.holidays',
};

export async function loader({ request, context: { session } }: LoaderFunctionArgs) {
  const params = pageable(
    searchParams(request, {
      order: '-createdTime',
    })
  );

  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['read:holiday'] }))) {
    throw redirect('/');
  }

  const holidaysPromise = api.get(`holidays?${params.toString()}`).match(
    (x) => (x.ok ? x.json() : paginated()),
    () => paginated()
  ) as Promise<Paginated<LeaveApplication>>;
  const title = await i18next.getFixedT(request, 'leaves.holidays').then((t) => t('meta.title'));

  return defer({
    title,
    holidaysPromise,
  });
}

export default function Route() {
  const { holidaysPromise } = useLoaderData<typeof loader>();
  const { t } = useTranslation('leaves.holidays');

  return (
    <>
      <div className="flex justify-between items-center gap-8">
        <h1>{t('h1')}</h1>
        <Button as="link" href="/leaves/holidays/new" className="w-fit flex gap-2 items-center">
          <PlusCircleIcon className="w-4" />
          <span className="mr-1">{t('createHoliday')}</span>
        </Button>
      </div>
      <Suspense fallback="Loading">
        <Await resolve={holidaysPromise}>
          <HolidayTable />
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
    const result = await api.delete(`holidays/${formData.get('id')}`);
    if (result.isErr()) {
      return json(
        fail(await toActionErrorsAsync(result.error), {
          id: formData.get('id') as string,
        })
      );
    }
    return json(ok());
  }
  return json(null);
}
