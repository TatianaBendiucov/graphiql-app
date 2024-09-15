import '@testing-library/jest-dom';

import { jest } from '@jest/globals';

const mockResponse = (data: object, status: number = 200): Response => {
  return {
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    redirected: false,
    type: 'default',
    url: '',
  } as Response;
};

global.fetch = jest.fn(
  (): Promise<Response> => Promise.resolve(mockResponse({})),
) as jest.MockedFunction<typeof fetch>;
