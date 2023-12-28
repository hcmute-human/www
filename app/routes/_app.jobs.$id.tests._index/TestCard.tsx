import type { Test } from '@lib/models/job';
import { useTranslation } from 'react-i18next';

interface Props {
  test: Test;
}

export default function TestCard({ test }: Props) {
  const { t } = useTranslation('jobs.$id.tests');
  return (
    <div className="px-8 py-4 text-primary-700 flex gap-4 items-center justify-between rounded-lg bg-primary-50">
      <div className="font-bold">
        <p className="font-bold">{test.name}</p>
        <p>{t('createdBy', { name: test.creator.firstName + ' ' + test.creator.lastName })}</p>
      </div>
    </div>
  );
}
