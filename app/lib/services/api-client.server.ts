import { Dispatcher, FormData, request } from 'undici';

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

type OptionsParameter = Exclude<Parameters<typeof request>[1], undefined>;
export interface RequestOptions extends Omit<OptionsParameter, 'body'> {
  body?: Record<number | string, unknown> | unknown[] | FormData | Buffer;
}

export interface ApiResponse {
  ok: boolean;
  body: Dispatcher.ResponseData['body'];
}

export class ApiClient {
  private static _instance: ApiClient | undefined = undefined;
  private static _options: ApiClientOptions | undefined = undefined;

  private constructor(private options: ApiClientOptions) {}

  public static get instance() {
    if (!ApiClient._instance) {
      if (!ApiClient._options) {
        throw new ReferenceError(
          'Failed to initialize ApiClient. An option must be provided using `ApiClient.use(options)` first'
        );
      }
      ApiClient._instance = new ApiClient(ApiClient._options);
      ApiClient._options = undefined;
    }
    return ApiClient._instance;
  }

  public static use(options: ApiClientOptions) {
    ApiClient._options = options;
  }

  protected async request(
    input: string | URL,
    options?: RequestOptions
  ): Promise<ApiResponse> {
    const url = typeof input === 'string' ? input : input.pathname;
    const response = await request(
      this.options.baseUrl +
        '/' +
        trim(url, '/').split('/').join('/') +
        '/' +
        this.options.version,
      options
        ? {
            ...options,
            body:
              options?.body instanceof FormData ||
              options?.body instanceof Buffer
                ? options.body
                : JSON.stringify(options?.body),
          }
        : undefined
    );
    return {
      ok: response.statusCode >= 200 && response.statusCode <= 299,
      body: response.body,
    };
  }

  public post(input: string | URL, options?: RequestOptions) {
    return this.request(input, {
      ...options,
      method: 'POST',
      headers: {
        ...options?.headers,
      },
    });
  }
}
