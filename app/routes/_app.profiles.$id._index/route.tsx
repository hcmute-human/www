import { dpr } from '@cloudinary/url-gen/actions/delivery';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { ar1X1 } from '@cloudinary/url-gen/qualifiers/aspectRatio';
import TextLink from '@components/TextLink';
import i18next from '@lib/i18n/index.server';
import { Gender, type Employee, type EmployeePosition } from '@lib/models/employee';
import { paginated, type Paginated } from '@lib/models/paginated';
import type { User } from '@lib/models/user';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { buildTitle, formatGender } from '@lib/utils';
import { fail, ok, type ActionErrorResponse, type ActionOkResponse } from '@lib/utils/action.server';
import { toImage } from '@lib/utils/asset.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import {
  defer,
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  type TypedResponse,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from 'remix-utils/client-only';
import AvatarUploadButton from './AvatarUploadButton';
import WorkSection from './WorkSection';
import Avatar from './Avatar.client';

export const handle = {
  i18n: 'profiles.$id',
  breadcrumb: true,
};

export const meta: MetaFunction<typeof loader> = ({ matches }) => buildTitle(matches);

export async function loader({ request, params: { id }, context: { session } }: LoaderFunctionArgs) {
  const api = SessionApiClient.from(session);
  const [user, employee] = await Promise.all([
    api.get(`users/${id}`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ) as Promise<User | null>,
    api.get(`employees/${id}`).match(
      (x) => (x.ok ? x.json() : null),
      () => null
    ) as Promise<Employee | null>,
  ]);
  if (!user) {
    throw redirect('/');
  }

  const positionsPromise = api
    .get(`employees/${id}/positions?includeDepartment=true&includeDepartmentPosition=true`)
    .match(
      (x) => (x.ok ? x.json() : paginated()),
      () => paginated()
    ) as Promise<Paginated<EmployeePosition>>;
  const title = await i18next.getFixedT(request, 'profiles.$id').then((t) => t('meta.title'));
  return defer({
    title,
    user: {
      ...user,
      avatar: user.avatar
        ? toImage(user.avatar)
            .resize(fill().aspectRatio(ar1X1()))
            .resize(scale(256, 256))
            .delivery(dpr('auto'))
            .format('auto')
            .quality('auto')
            .toURL()
        : undefined,
    },
    employee,
    positionsPromise,
  });
}

export default function Route() {
  const { t } = useTranslation('profiles.$id');
  const { user, employee, positionsPromise } = useLoaderData<typeof loader>();
  const name = employee
    ? `${employee.firstName} ${employee.lastName}`
    : user.email.substring(0, user.email.indexOf('@'));

  function ContactTable() {
    return (
      <table>
        <tbody>
          <tr className="align-top">
            <td className="pr-2">Email:</td>
            <td>
              <TextLink href={`mailto:${user.email}`}>{user.email}</TextLink>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
  return (
    <div className="space-y-8">
      <div className="relative grid justify-center flex-nowrap md:flex md:justify-start gap-x-4 gap-y-2 md:pb-10">
        <div className="relative overflow-visible mb-10 md:mb-0 w-full max-w-[12rem]">
          <div className="group relative rounded-full w-full aspect-square before:transition-transform before:ease-in-out hover:before:border-primary-100 hover:before:scale-95 before:duration-500 before:content-[''] before:absolute before:inset-0 before:rounded-full before:border before:border-primary-200 overflow-clip">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform ease-in duration-300 hover:shadow-lg hover:shadow-negative-500 hover:drop-shadow-lg"
              />
            ) : (
              <ClientOnly>
                {() => (
                  <Avatar
                    config={{ sex: employee?.gender === Gender.Female ? 'woman' : 'man' }}
                    className="w-full h-full group-hover:scale-105 transition-transform ease-in duration-300"
                  />
                )}
              </ClientOnly>
            )}
          </div>
          <div className="w-max absolute bottom-0 translate-y-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2">
            <AvatarUploadButton />
          </div>
        </div>
        <div className="md:flex grow items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h1 className="font-bold m-0 leading-none">{name}</h1>
            {employee?.gender ? formatGender(employee.gender) : null}
          </div>
          <div className="hidden md:block">
            <h2 className="sr-only">{t('contact')}</h2>
            <ContactTable />
          </div>
        </div>
      </div>

      <div className="md:hidden pt-2">
        <h2>Contact</h2>
        <ContactTable />
      </div>

      {employee ? (
        <div className="pt-2">
          <h2 className="mb-2">Work</h2>
          <WorkSection employee={employee} positionsPromise={positionsPromise} />
        </div>
      ) : null}
    </div>
  );
}

type ActionPayload = { _action: 'upload' | 'patch' };
export type ActionResponse =
  | ActionOkResponse<ActionPayload & { uploadUrl?: string }>
  | ActionErrorResponse<ActionPayload>
  | null;
export async function action({
  request,
  context: { session },
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> {
  switch (request.method.toLocaleLowerCase()) {
    case 'post': {
      const data = await request.json();
      if (data._action === 'upload') {
        const api = SessionApiClient.from(session);
        const { sub } = session.decode();
        const result = await api.post(`users/${sub}/avatars/upload-request`);
        if (result.isErr()) {
          return json(fail(await toActionErrorsAsync(result.error), { _action: 'upload' as const }));
        }
        return json(ok({ ...(await result.value.json()), _action: 'upload' as const }));
      }
      if (data._action === 'patch') {
        const api = SessionApiClient.from(session);
        const { sub } = session.decode();
        const result = await api.patch(`users/${sub}`, {
          body: {
            patch: [
              {
                op: 'replace',
                path: '/avatar/key',
                value: data.key,
              },
              {
                op: 'replace',
                path: '/avatar/version',
                value: data.version,
              },
              {
                op: 'replace',
                path: '/avatar/format',
                value: data.format,
              },
            ],
          },
        });
        if (result.isErr()) {
          return json(fail(await toActionErrorsAsync(result.error), { _action: 'patch' as const }));
        }
        return json(ok({ _action: 'patch' as const }));
      }
      break;
    }
  }
  return json(null);
}
