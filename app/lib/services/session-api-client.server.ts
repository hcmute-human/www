import type { ResultAsync } from 'neverthrow';
import {
  ApiClient,
  type ApiResponse,
  type RequestOptions,
} from './api-client.server';
import { getSession } from './session.server';

export class SessionApiClient extends ApiClient {
  private constructor(private readonly _bearerToken: string) {
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
    return super.fetch(input, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${this._bearerToken}`,
      },
    });
  }

  public static async from(request: Request): Promise<ApiClient> {
    const token = await getSession(request).then((x) => x.get('accessToken'));
    return token ? new SessionApiClient(token) : ApiClient.instance;
  }
}
