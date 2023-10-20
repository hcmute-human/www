import { Outlet } from 'react-router-dom';
import Header from './Header';
import ToolBar from './ToolBar';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import i18next from '@lib/i18n/index.server';

export function handle() {
  return { i18n: ['meta', 'home'] };
}

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const title = await i18next
    .getFixedT(request, 'meta')
    .then((x) => x('home.title'));
  return { title };
}

function App() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <Header />
      <div className="bg-primary-0 flex-grow">
        <div className="lg:inline-block w-full hidden">
          <ToolBar />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
