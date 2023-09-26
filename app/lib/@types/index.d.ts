declare type ActionError = Record<string, string>;

declare namespace NodeJS {
	interface ProcessEnv {
		API_BASE_URL?: string;
		COOKIE_SECRET?: string;
	}
}
