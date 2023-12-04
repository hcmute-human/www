import { useTheme } from '@lib/contexts/theme.context';
import i18next from '@lib/i18n/index.server';
import { cssBundleHref } from '@remix-run/css-bundle';
import { json, type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from '@remix-run/react';
import { RouterProvider } from 'react-aria';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next';
import styles from './root.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ locale: await i18next.getLocale(request) });
}

export const handle = {
  i18n: 'common',
};

export const shouldRevalidate = () => false;

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RouterProvider navigate={navigate}>
          <Outlet />
        </RouterProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
