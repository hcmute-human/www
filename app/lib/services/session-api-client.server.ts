import { err, fromPromise, ok, type ResultAsync } from 'neverthrow';
import {
  ApiClient,
  ApiError,
  type ApiResponse,
  type RequestOptions,
} from './api-client.server';
import { type SessionData } from './session.server';
import type { Session } from '@remix-run/node';

export class SessionApiClient extends ApiClient {
  private constructor(
    private readonly _session: Session<SessionData, unknown>
  ) {
    if (!ApiClient._options) {
      throw new ReferenceError(
        'Failed to initialize SessionApiClient. An option must be provided using `ApiClient.use(options)` first'
      );
    }
    super(ApiClient._options);
  }

  protected fetch(
    input: string | URL,
    options?: RequestOptions
  ): ResultAsync<ApiResponse, Error> {
    return super
      .fetch(input, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${this._session.get('accessToken')}`,
        },
      })
      .orElse((x) => {
        if (x instanceof ApiError && x.details.status === 401) {
          const refreshToken = this._session.get('refreshToken');
          if (!refreshToken) {
            return err(x);
          }
          return super
            .fetch('auth/refresh', {
              method: 'post',
              body: { refreshToken },
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .orElse(() => err(x))
            .andThen((x) => {
              if (x.status === 200) {
                interface RefreshResponse {
                  accessToken: string;
                  refreshToken: string;
                }
                return fromPromise(x.json() as Promise<RefreshResponse>, (e) =>
                  e instanceof Error
                    ? e
                    : new Error('Unable to process request', { cause: e })
                ).andThen(({ accessToken, refreshToken }) => {
                  this._session.set('accessToken', accessToken);
                  this._session.set('refreshToken', refreshToken);
                  return super.fetch(input, {
                    ...options,
                    headers: {
                      ...options?.headers,
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });
                });
              }
              return ok(x);
            });
        }
        return err(x);
      });
  }

  public static async from(
    session: Session<SessionData, unknown>
  ): Promise<ApiClient> {
    return session.has('accessToken') || session.has('refreshToken')
      ? new SessionApiClient(session)
      : ApiClient.instance;
  }
}
