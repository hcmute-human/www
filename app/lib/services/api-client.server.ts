import { problemDetailsSchema } from '@lib/schemas/problem-details.server';
import { ResultAsync, err, errAsync, fromPromise, fromSafePromise, ok } from 'neverthrow';

interface ApiClientOptions {
  baseUrl: string;
  version: string;
}

function trim(input: string, char: string) {
  let start = 0;
  let end = input.length;
  while (input[start] === char) ++start;
  while (input[--end] === char);
  if (end < start) end = start - 1;
  return input.substring(start, end + 1);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<number | string, any> | any[] | FormData | Buffer;
}

export interface ApiResponse extends Response {}

export class ApiError extends Error {
  private constructor(private readonly details_: Zod.infer<typeof problemDetailsSchema>) {
    super();
  }

  public get details() {
    return this.details_;
  }

  public static async from(details: unknown) {
    const data = await problemDetailsSchema.parseAsync(details);
    return new ApiError(data);
  }
}

export class ApiClient {
  private static _instance: ApiClient | undefined = undefined;
  protected static _options: ApiClientOptions | undefined = undefined;

  protected constructor(private readonly _options: ApiClientOptions) {}

  public static get instance() {
    if (!ApiClient._instance) {
      if (!ApiClient._options) {
        throw new ReferenceError(
          'Failed to initialize ApiClient. An option must be provided using `ApiClient.use(options)` first'
        );
      }
      ApiClient._instance = new ApiClient(ApiClient._options);
    }
    return ApiClient._instance;
  }

  public static use(options: ApiClientOptions) {
    ApiClient._options = options;
  }

  protected fetch(input: string | URL, { headers, ...options }: RequestOptions = {}): ResultAsync<ApiResponse, Error> {
    let url = typeof input === 'string' ? input : input.pathname;
    const record: Record<string, string> = ApiClient.makeHeaders(headers);
    if (options?.body) {
      record['Content-Type'] ??=
        options.body instanceof FormData || options?.body instanceof Buffer
          ? 'multipart/form-data'
          : 'application/json';
    }
    const [path, query] = url.split('?', 2);
    url = this._options.baseUrl + '/' + trim(path, '/').split('/').join('/') + '/' + this._options.version;
    if (query) {
      url += '?' + query;
    }
    return fromPromise(
      fetch(
        url,
        options
          ? {
              ...options,
              headers: record,
              body:
                options?.body instanceof FormData || options?.body instanceof Buffer
                  ? options.body
                  : JSON.stringify(options?.body),
            }
          : undefined
      ),
      (e) => (e instanceof Error ? e : new Error('Unexpected error', { cause: e }))
    ).andThen((x) =>
      x.ok
        ? ok(x)
        : fromPromise(x.json(), () =>
            fromSafePromise(
              ApiError.from({
                status: x.status,
                title: x.statusText,
                type: 'https://tools.ietf.org/html/rfc7231#section-6.5.5',
              })
            ).andThen((x) => err(x))
          )
            .andThen((x) =>
              fromPromise(ApiError.from(x), () =>
                fromSafePromise(
                  ApiError.from({
                    status: x.status,
                    title: x.statusText,
                    type: 'https://tools.ietf.org/html/rfc7231#section-6.5.5',
                  })
                ).andThen((x) => err(x))
              ).andThen((x) => err(x))
            )
            .mapErr(async (x) =>
              x instanceof ResultAsync
                ? x.match(
                    (x) => x,
                    (x) => x
                  )
                : x
            )
    );
  }

  public get(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'GET',
    });
  }

  public post(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'POST',
    });
  }

  public delete(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'DELETE',
    });
  }

  public head(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'HEAD',
    });
  }

  public count(input: string | URL, options?: RequestOptions) {
    return this.head(input, options).andThen((x) =>
      ok(x.ok ? this.parseContentRangeTotalCount(x.headers.get('Content-Range')) : 0)
    );
  }

  public put(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'PUT',
    });
  }

  public exists(input: string | URL, options?: RequestOptions) {
    return this.head(input, options).match(
      (x) => x.ok,
      () => false
    );
  }

  public patch(input: string | URL, options?: RequestOptions) {
    return this.fetch(input, {
      ...options,
      method: 'PATCH',
    });
  }

  private parseContentRangeTotalCount(contentRange?: string | null) {
    if (!contentRange) return 0;
    return Number(contentRange.substring(contentRange.lastIndexOf('/') + 1).trim());
  }

  private static makeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};
    return Array.isArray(headers)
      ? Object.fromEntries(headers)
      : headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : headers;
  }
}
