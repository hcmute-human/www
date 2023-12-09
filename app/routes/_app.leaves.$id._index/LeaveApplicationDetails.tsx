import BoxAlert from '@components/BoxAlert';
import Button from '@components/Button';
import DatePicker from '@components/DatePicker';
import Form from '@components/Form';
import InlineAlert from '@components/InlineAlert';
import ListBoxItem from '@components/ListBoxItem';
import Loading from '@components/Loading';
import SelectField from '@components/SelectField';
import TextField from '@components/TextField';
import UncontrolledTextField from '@components/UncontrolledTextField';
import { CheckIcon } from '@heroicons/react/20/solid';
import { LeaveApplicationStatus, type LeaveApplication, type LeaveType } from '@lib/models/leave';
import { parseSubmission } from '@lib/utils';
import { parseDateFromAbsolute } from '@lib/utils/date';
import { makeErrorMap } from '@lib/utils/zod';
import { Await, useActionData, useNavigation } from '@remix-run/react';
import type { TFunction } from 'i18next';
import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  leaveApplication: LeaveApplication;
  leaveTypesPromise: Promise<LeaveType[]>;
  canUpdate: boolean;
}

export default function LeaveApplicationDetails({ leaveApplication, leaveTypesPromise, canUpdate }: Props) {
  return <></>;
}
