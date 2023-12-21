import Button from '@components/Button';
import { useFetcher } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { FileTrigger } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import type { ActionResponse } from './route';
import ProgressCircle from '@components/ProgressCircle';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

export default function AvatarUploadButton() {
  const { t } = useTranslation('profiles.$id');
  const { submit, data, json } = useFetcher<ActionResponse>();
  const fileRef = useRef<File | null>(null);
  const pending = data != null && data._action !== 'patch';

  useEffect(() => {
    if (!fileRef.current || data?.ok !== true || data._action !== 'upload') {
      return;
    }

    (async () => {
      try {
        const formData = new FormData();
        formData.set('file', fileRef.current!);
        const response = await fetch(data.uploadUrl!, { method: 'post', body: formData });
        if (response.ok) {
          const data = await response.json();
          submit(
            { key: data.public_id, version: data.version, format: data.format, _action: 'patch' },
            { encType: 'application/json', method: 'post' }
          );
        }
      } finally {
        fileRef.current = null;
      }
    })();
  }, [data]);

  return (
    <FileTrigger
      onSelect={(e) => {
        const file = e?.item(0);
        if (!file) {
          return;
        }
        fileRef.current = file;
        submit({ _action: 'upload' }, { method: 'post', encType: 'application/json' });
      }}
      acceptedFileTypes={['image/*']}
    >
      <Button isDisabled={pending}>
        <span className={clsx('block transition-transform ease-in-out', pending && 'scale-0')}>{t('upload')}</span>
        <Transition
          show={pending}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3"
          enter="transition ease-in-out"
          enterFrom="opacity-0 scale-0"
          leave="transition ease-in-out duration-300"
          leaveTo="opacity-0 scale-0"
        >
          <ProgressCircle className="w-full h-full text-primary-500" aria-label="Uploading avatar" />
        </Transition>
      </Button>
    </FileTrigger>
  );
}
