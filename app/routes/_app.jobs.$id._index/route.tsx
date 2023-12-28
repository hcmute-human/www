import TextEditor from '@components/TextEditor';
import type { Job } from '@lib/models/job';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { useMatches } from '@remix-run/react';
import { DocumentCheckIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import StatisticCard from './StatisticCard';

export const handle = {
  i18n: 'jobs.$id',
};

export async function loader({ params: { id } }: LoaderFunctionArgs) {
  return json({
    id,
  });
}

export default function Route() {
  const { job } = useMatches().at(-2)!.data as { job: Job };
  const { t } = useTranslation('jobs.$id');

  return (
    <div className="space-y-6">
      <div>
        <h1>{job.title}</h1>
        <p>
          {t('createdOn', {
            createdTime: new Date(job.createdTime),
            formatParams: { createdTime: { dateStyle: 'long' } },
          })}
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 mt-2">
        <StatisticCard
          icon={<DocumentIcon className="w-10 h-10" />}
          label={t('tests')}
          number={0}
          className="capitalize text-info-500 bg-info-50"
        />
        <StatisticCard
          icon={<DocumentCheckIcon className="w-10 h-10" />}
          label={t('jobApplications')}
          number={0}
          className="capitalize text-positive-500 bg-positive-50"
        />
      </div>
      <div>
        <h2 className="mb-1">{t('description')}</h2>
        <TextEditor defaultValue={job.description} editable={false} />
      </div>
    </div>
  );
}

export async function action({ request, context: { session } }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get('_action') === 'delete') {
    const result = await SessionApiClient.from(session).delete(
      `jobs/${formData.get('employeeId')}/positions/${formData.get('departmentPositionId')}`
    );
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
      });
    }
    return json({ ok: true });
  }
  return json(null);
}
