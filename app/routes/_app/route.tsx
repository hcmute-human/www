import Breadcrumbs from '@components/Breadcrumbs';
import TextLink from '@components/TextLink';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useMatches, type UIMatch } from '@remix-run/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next
    .getFixedT(request, 'meta')
    .then((t) => t('home.title'));
  return json({ title });
}

export const handle = {
  i18n: 'meta',
  breadcrumb: true,
};

function isMatchWithBreadcrumb(
  x: unknown
): x is UIMatch<Required<RouteData>, Required<RouteHandle>> {
  return (
    typeof x === 'object' &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).handle
      ?.breadcrumb &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).data.title
  );
}

function App() {
  const matches = useMatches();
  const breadcrumbItems = matches
    .filter((x): x is UIMatch<RouteData, Required<RouteHandle>> =>
      isMatchWithBreadcrumb(x)
    )
    .map((x, i, arr) => ({
      key: x.id,
      node: (
        <>
          <TextLink
            href={x.pathname}
            variant="primary"
            className="transition-[color_font-weight] ease-in-out group-last:font-bold group-last:text-primary-900 group-last:pointer-events-none"
          >
            {i === 0 ? <HomeIcon className="w-4 h-4" /> : x.data.title}
          </TextLink>
          {i !== arr.length - 1 ? (
            <ChevronRightIcon className="w-4 h-4 text-primary-500" />
          ) : null}
        </>
      ),
    }));
  const title = (
    matches.at(-1)?.data as unknown as Record<string, string | undefined> | null
  )?.title;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <Header />
      <div className="bg-primary-0 flex-grow p-4">
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        {title ? <h1 className="leading-none">{title}</h1> : null}
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
