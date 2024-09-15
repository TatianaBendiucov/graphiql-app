import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import RestfulApiPlayground from '@/components/RestfulApiMain';
import * as utils from '@/utils/utils';
import * as localStorageHelpers from '@/utils/localStorageHelpers';
import { HttpMethod } from '@/types/routesTypes';
import { useTranslation } from '@/components/i18n/client';
import { showToast } from '@/components/ShowToast';
import useAuth from '@/hooks/useAuth';

jest.mock('@/utils/utils', () => ({
  buildRestfulApiUrl: jest.fn(),
}));

jest.mock('@/utils/localStorageHelpers', () => ({
  getRequestById: jest.fn(),
  saveRequestToLocalStorage: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => jest.fn());

jest.mock('cm6-graphql', () => ({
  graphql: jest.fn(),
}));

jest.mock('@codemirror/lang-json', () => ({
  json: jest.fn(),
}));

jest.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: jest.fn(({ value, onChange }) => (
    <textarea
      data-testid="code-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )),
}));

jest.mock('@/components/i18n/client', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => 'mocked_id'),
  })),
}));

jest.mock('@/components/ShowToast', () => ({
  showToast: jest.fn(),
}));

const mockCurrentUser = {
  getIdToken: jest.fn().mockResolvedValue('mockToken'),
  uid: 'mockUid',
};

describe('RestfulApiPlayground', () => {
  const mockLoading = false;

  let originalWarn: jest.SpyInstance;
  let originalError: jest.SpyInstance;

  beforeAll(() => {
    originalWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    originalError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    originalWarn.mockRestore();
    originalError.mockRestore();
  });
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
      loading: mockLoading,
    });

    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders RestfulApiPlayground and submits a request', async () => {
    render(<RestfulApiPlayground />);
    const endpointInput = screen.getByLabelText('inputs.endpoint');

    if (endpointInput)
      fireEvent.change(endpointInput, {
        target: { value: 'https://rickandmortyapi.com/api/test' },
      });

    const codeMirrorTextarea = screen.getAllByTestId('code-editor');
    fireEvent.change(codeMirrorTextarea[0], {
      target: { value: '{"key": "value"}' },
    });

    fireEvent.click(screen.getByText('inputs.send'));
    await waitFor(() =>
      expect(showToast).toHaveBeenCalledWith('success', 'success'),
    );

    expect(utils.buildRestfulApiUrl).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      endpoint: 'https://rickandmortyapi.com/api/test',
      body: JSON.stringify('{"key": "value"}')
        .replace(/\\n/g, '')
        .replace(/\s+/g, ' '),
      headers: [],
    });

    expect(localStorageHelpers.saveRequestToLocalStorage).toHaveBeenCalledWith(
      mockCurrentUser.uid,
      expect.any(Object),
    );
  });

  test('handles invalid JSON', async () => {
    render(<RestfulApiPlayground />);

    const endpointInput = screen.getByLabelText('inputs.endpoint');
    fireEvent.change(endpointInput, {
      target: { value: 'https://rickandmortyapi.com/api/test' },
    });

    const codeMirrorTextarea = screen.getAllByTestId('code-editor');
    fireEvent.change(codeMirrorTextarea[1], {
      target: { value: 'invalid' },
    });
    fireEvent.click(screen.getByText('inputs.send'));

    await waitFor(() => screen.getByText('errors.json'));
  });
});
