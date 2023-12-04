import Tabs from '@components/Tabs';
import i18next from '@lib/i18n/index.server';
import type { Department } from '@lib/models/department';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

export const handle = {
  i18n: 'departments.$id',
};

export async function loader({
  request,
  context: { session },
  params,
}: LoaderFunctionArgs) {
  return json(null);
}

export default function Route() {
  return <>Settings</>;
}

export async function action({
  request,
  context: { session },
}: ActionFunctionArgs) {
  return json(null);
}
