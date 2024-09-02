import { HttpMethod } from '@/types/routesTypes';

const BASE_URL = 'http://localhost:3000';

export const encodeBase64 = (input: string): string => {
  return Buffer.from(input, 'utf-8').toString('base64');
};

interface BuildGraphQLUrlParams {
  endpoint: string;
  body: string;
  headers: { key: string; value: string }[] | null;
}

export const buildGraphQLUrl = ({
  endpoint,
  body,
  headers,
}: BuildGraphQLUrlParams): string => {
  const encodedEndpoint = encodeBase64(endpoint);
  const encodedBody = encodeBase64(body);

  let url = `${BASE_URL}/GRAPHQL/${encodedEndpoint}/${encodedBody}`;

  if (headers) {
    const headerParams = headers
      .filter((header) => header.key && header.value)
      .map(
        (header) =>
          `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
      )
      .join('&');

    if (headerParams) {
      url += `?${headerParams}`;
    }
  }

  return url;
};

interface BuildRestfulApiUrlParams {
  method: HttpMethod;
  endpoint: string;
  body: string | null;
  headers: { key: string; value: string }[] | null;
}

export const buildRestfulApiUrl = ({
  method,
  endpoint,
  body,
  headers,
}: BuildRestfulApiUrlParams): string => {
  const encodedEndpoint = encodeBase64(endpoint);

  let url = `${BASE_URL}/${method}/${encodedEndpoint}`;
  if (body) {
    const encodedBody = encodeBase64(body);
    url += `/${encodedBody}`;
  }

  if (headers) {
    const headerParams = headers
      .filter((header) => header.key && header.value)
      .map(
        (header) =>
          `${encodeURIComponent(header.key)}=${encodeURIComponent(header.value)}`,
      )
      .join('&');

    if (headerParams) {
      url += `?${headerParams}`;
    }
  }

  return url;
};
