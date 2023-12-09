export type ActionOkResponse<T extends object = {}> = { ok: true } & T;
export type ActionErrorResponse<T extends object = {}> = { ok: false; error: ActionError } & T;

export function fail(error: ActionError): ActionErrorResponse;
export function fail<T extends Record<string | number | symbol, any>>(
  error: ActionError,
  data: T
): ActionErrorResponse & T;
export function fail<T extends Record<string | number | symbol, any>>(error: ActionError, data?: T) {
  return { ...(data ?? {}), ok: false, error };
}

export function ok(): ActionOkResponse;
export function ok<T extends Record<string | number | symbol, any>>(data: T): ActionOkResponse & T;
export function ok<T>(data?: T) {
  return { ok: true, ...(data ?? {}) };
}

export function unauthorized<T extends object>(data?: T): ActionErrorResponse<T> {
  return fail({ form: ['Unauthorized'] }, data!);
}
