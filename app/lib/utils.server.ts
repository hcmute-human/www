import { ZodError } from 'zod';
import { problemDetailsSchema } from './schemas/problem-details.server';
import { ApiError } from './services/api-client.server';
import { parse } from '@conform-to/zod';
import type { Submission } from '@conform-to/react';

export async function toActionErrorsAsync<T>(
  body: ZodError<T>
): Promise<ActionError>;
export async function toActionErrorsAsync(body: ApiError): Promise<ActionError>;
export async function toActionErrorsAsync(body: Error): Promise<ActionError>;
export async function toActionErrorsAsync(body: unknown): Promise<ActionError>;
export async function toActionErrorsAsync(body: unknown): Promise<ActionError> {
  if (body instanceof ApiError) {
    return body.details.errors
      ? body.details.errors.reduce((acc, cur) => {
          if (Array.isArray(acc[cur.name])) {
            acc[cur.name].push(cur.code ?? cur.reason);
          } else {
            acc[cur.name] = [cur.code ?? cur.reason];
          }
          return acc;
        }, {} as ActionError)
      : { form: [body.details.detail ?? body.details.title] };
  }

  if (body instanceof ZodError) {
    return body.flatten().fieldErrors as ActionError;
  }

  if (body instanceof Error) {
    return { form: [`${body.name}: ${body.message}`] };
  }

  const parse = await problemDetailsSchema.safeParseAsync(body);
  if (parse.success) {
    return parse.data.errors == null
      ? { form: [parse.data.detail ?? parse.data.title] }
      : parse.data.errors.reduce((acc, cur) => {
          if (Array.isArray(acc[cur.name])) {
            acc[cur.name].push(cur.code ?? cur.reason);
          } else {
            acc[cur.name] = [cur.code ?? cur.reason];
          }
          return acc;
        }, {} as ActionError);
  }
  return { form: ['Unable to process request'] };
}

interface SubmissionWithOk extends Submission {
  ok: boolean;
}

export async function parseSubmissionAsync(
  formData: FormData,
  config: Omit<Parameters<typeof parse>[1], 'async'>
): Promise<SubmissionWithOk> {
  const submission = await parse(formData, { ...config, async: true });
  return {
    ...submission,
    ok: submission.intent === 'submit' && !!submission.value,
  };
}
