import { ApiClient } from '@lib/services/api-client.server';

export function startup() {
  if (!process.env.API_BASE_URL) {
    throw new ReferenceError(
      'API_BASE_URL environment variable must be provided'
    );
  }

  ApiClient.use({
    baseUrl: process.env.API_BASE_URL ?? '',
    version: 'v1',
  });
}
