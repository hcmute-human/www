import Breadcrumbs from '@components/Breadcrumbs';
import Button from '@components/Button';
import TextLink from '@components/TextLink';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useMatches, type UIMatch } from '@remix-run/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { SessionApiClient } from '@lib/services/session-api-client.server';

export const handle = {
  i18n: 'home',
};

export async function loader({ context: { session } }: LoaderFunctionArgs) {
  if (!(await SessionApiClient.from(session).authenticate())) {
    session.unset('accessToken');
    session.unset('refreshToken');
    throw redirect('/login');
  }
  return json({ id: session.decode().sub });
}

function isMatchWithBreadcrumb(x: unknown): x is UIMatch<Required<RouteData>, Required<RouteHandle>> {
  return (
    typeof x === 'object' &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).handle?.breadcrumb &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).data.title
  );
}

export const shouldRevalidate = () => false;

function App() {
  const matches = useMatches();
  const breadcrumbItems = matches
    .filter((x): x is UIMatch<RouteData, Required<RouteHandle>> => isMatchWithBreadcrumb(x))
    .map((x, i, arr) => ({
      key: x.id,
      node: (
        <>
          <TextLink
            href={x.pathname}
            variant="primary"
            className="text-primary-400 transition-[color_font-weight] ease-in-out group-last:font-bold group-last:text-primary-900 group-last:pointer-events-none"
          >
            {x.data.title}
          </TextLink>
          {i !== arr.length - 1 ? <ChevronRightIcon className="w-4 h-4 text-primary-400" /> : null}
        </>
      ),
    }));

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <Header />
      <div className="relative grid auto-rows-[min-content_1fr] flex-grow max-h-screen overflow-auto mt-14">
        <div className="p-4 outline-none">
          <Outlet />
        </div>
        <div className="mt-16 lg:mt-0 flex border-b-primary-100 bg-primary-0 h-14 items-center border-b px-4 lg:py-4 gap-4 fixed w-full top-0">
          <Button variant="primary" className="p-1 rounded border border-primary-100 text-primary-950 bg-transparent">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
