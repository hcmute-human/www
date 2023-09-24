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
	body?: Record<number | string, unknown> | unknown[];
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

	public fetch(input: string | URL, init?: RequestInit) {
		const url = typeof input === 'string' ? input : input.pathname;
		return fetch(
			this.options.baseUrl +
				'/' +
				trim(url, '/').split('/').join('/') +
				'/' +
				this.options.version,
			init
		);
	}

	public post(input: string | URL, init?: RequestOptions) {
		const requestInit = {
			...init,
			method: 'post',
			body:
				init?.body instanceof FormData
					? (init.body as FormData)
					: JSON.stringify(init?.body),
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
		};

		return this.fetch(input, requestInit);
	}
}
