import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await authenticate(request))) {
    throw redirect('/login');
  }
  return json(null);
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
