import i18next from '@lib/i18n/index.server';
import { paginated, type Paginated } from '@lib/models/paginated';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle } from '@lib/utils';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  type TypedResponse,
} from '@remix-run/node';
import { useActionData, useFetchers, useLoaderData, useSubmit, type Fetcher } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import PermissionAction from './PermissionAction';

export const handle = {
  i18n: 'employees.$id.permissions',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export const shouldRevalidate = () => false;

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['read:userPermission'] }))) {
    throw redirect('/');
  }

  const [title, permissions, userPermissions] = await Promise.all([
    i18next.getFixedT(request, 'employees.$id.permissions').then((t) => t('meta.title')),
    api.get('/permissions?size=100').match(
      (x) => (x.ok ? x.json() : paginated()),
      () => paginated()
    ) as Promise<Paginated<string>>,
    api.get(`/user-permissions/${id}?size=100`).match(
      (x) => (x.ok ? x.json() : paginated()),
      () => paginated()
    ) as Promise<Paginated<string>>,
  ]);

  return json({
    id,
    title,
    permissions,
    userPermissions,
  });
}

function toGroup(acc: Record<string, string[]>, cur: string) {
  const [action, name] = cur.split(':', 2);
  if (!name) {
    return acc;
  }
  if (!acc[name]) {
    acc[name] = [action];
  } else {
    acc[name].push(action);
  }
  return acc;
}

function toFlagObject(acc: Record<string, Record<string, boolean>>, cur: string) {
  const [action, name] = cur.split(':', 2);
  if (!name) {
    return acc;
  }
  if (!acc[name]) {
    acc[name] = { [action]: true };
  } else {
    acc[name][action] = true;
  }
  return acc;
}

function formatPermissionName(name: string) {
  return (name[0].toLocaleUpperCase() + name.substring(1))
    .split(/([A-Z][a-z]+)/)
    .filter((x) => !!x)
    .join(' ');
}

const byAlphabeticallyAsc = new Intl.Collator().compare;
const byPermissionAlphabeticallyAsc = (a: string, b: string) => {
  const [action1, name1] = a.split(':', 2);
  const [action2, name2] = b.split(':', 2);
  return byAlphabeticallyAsc(name1, name2) || byAlphabeticallyAsc(action1, action2);
};
const toFetcherError = (acc: Record<string, Fetcher & { key: string }>, cur: Fetcher & { key: string }) => {
  acc[cur.key] = cur;
  return acc;
};

export default function Route() {
  const { permissions, userPermissions } = useLoaderData<typeof loader>();
  const permissionGroup = useMemo(
    () => permissions.items.toSorted(byPermissionAlphabeticallyAsc).reduce(toGroup, {}),
    [permissions]
  );
  const userPermissionFlag = useMemo(() => userPermissions.items.reduce(toFlagObject, {}), [userPermissions]);
  const submit = useSubmit();
  const fetchers = useFetchers();
  const fetcherError = useMemo(
    () => fetchers.filter((x) => x.data?.ok === false).reduce(toFetcherError, {}),
    [fetchers]
  );

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-8">
      {Object.entries(permissionGroup).map(([name, actions]) => (
        <div key={name}>
          <h4 className="mb-1">{formatPermissionName(name)}</h4>
          <div className="columns-[4rem] gap-4 space-y-2">
            {actions.map((action) => (
              <PermissionAction
                key={action}
                text={action}
                defaultSelected={!!userPermissionFlag[name]?.[action]}
                onChange={(isSelected) => {
                  submit(
                    { name, action, isSelected },
                    {
                      method: 'POST',
                      navigate: false,
                      fetcherKey: `${action}:${name}`,
                      encType: 'application/json',
                    }
                  );
                }}
                isError={!!fetcherError[`${action}:${name}`]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type ActionResponse = { ok: true } | { ok: false; error: ActionError; name: string; action: string } | null;
export async function action({
  request,
  context: { session },
  params: { id },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  const api = SessionApiClient.from(session);
  if (!(await api.authorize({ permissions: ['create:userPermission', 'delete:userPermission'] }))) {
    return json(null);
  }

  const { name, action, isSelected } = await request.json();
  if (!name || !action) {
    return json(null);
  }

  if (isSelected === true) {
    const result = await api.post(`user-permissions/${id}`, {
      body: { permission: `${action}:${name}` },
    });
    if (result.isErr()) {
      return json({ ok: false, error: await toActionErrorsAsync(result.error), name, action });
    }
    return json({ ok: true });
  } else if (isSelected === false) {
    const result = await api.delete(`user-permissions/${id}/${action}:${name}`);
    if (result.isErr()) {
      return json({ ok: false, error: await toActionErrorsAsync(result.error), name, action });
    }
    return json({ ok: true });
  }
  return json(null);
}
