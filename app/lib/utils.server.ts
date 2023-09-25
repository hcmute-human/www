import { problemDetailsSchema } from './schemas/problem-details.server';

export async function toActionErrorsAsync(body: unknown): Promise<ActionError> {
	if (body instanceof Error) {
		return { root: `${body.name}: ${body.message}` };
	}

	const parse = await problemDetailsSchema.safeParseAsync(body);
	if (parse.success) {
		return parse.data.errors == null
			? { root: parse.data.detail ?? parse.data.title }
			: Object.fromEntries(
					parse.data.errors.map((x) => [x.name, x.code ?? x.reason])
			  );
	}
	return { root: 'Unable to process request' };
}
