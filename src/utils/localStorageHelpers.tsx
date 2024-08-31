type RequestType = 'REST' | 'GraphQL';

export interface RequestHistoryItem {
  id: string;
  type: RequestType;
  timestamp: number;
  url: string;
  method?: string; // For RESTful
  headers: { key: string; value: string }[];
  body?: string; // For RESTful
  variables?: string; // For RESTful
  sdl?: string; // For GraphQL
}

const LOCAL_STORAGE_KEY = 'requestHistory';

export const saveRequestToLocalStorage = (request: RequestHistoryItem) => {
  const history = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
  ) as RequestHistoryItem[];
  history.push(request);
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(history.sort((a, b) => b.timestamp - a.timestamp)),
  );
};

export const getRequestHistoryFromLocalStorage = (): RequestHistoryItem[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
};

export const clearRequestHistory = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const getRequestById = (
  uuid: string,
): RequestHistoryItem | undefined => {
  const storedData = localStorage.getItem('requestHistory');

  if (storedData) {
    const requestHistory: RequestHistoryItem[] = JSON.parse(storedData);

    return requestHistory.find((item) => item.id === uuid);
  }

  return undefined;
};
