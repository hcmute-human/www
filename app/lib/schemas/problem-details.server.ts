import { z } from 'zod';

export const problemDetailsSchema = z.object({
	type: z.string(),
	title: z.string(),
	status: z.number(),
	detail: z.optional(z.string()),
	instance: z.optional(z.string()),
	traceId: z.optional(z.string()),
	errors: z.optional(
		z.array(
			z.object({
				name: z.string(),
				reason: z.string(),
				code: z.optional(z.string()),
			})
		)
	),
});
