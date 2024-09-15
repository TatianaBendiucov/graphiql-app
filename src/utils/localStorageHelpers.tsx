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

export const saveRequestToLocalStorage = (
  currentUser: string,
  request: RequestHistoryItem,
) => {
  const history = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || '{}',
  ) as Record<string, RequestHistoryItem[]>;

  const userHistory = history[currentUser] || [];
  userHistory.push(request);

  history[currentUser] = userHistory.sort(
    (a: RequestHistoryItem, b: RequestHistoryItem) => b.timestamp - a.timestamp,
  );

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
};

export const getRequestHistoryFromLocalStorage = (
  currentUser: string,
): RequestHistoryItem[] => {
  const history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

  return history[currentUser] || [];
};

export const clearRequestHistory = (currentUser: string) => {
  const allHistory = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || '{}',
  );
  delete allHistory[currentUser];

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allHistory));
};

export const getRequestById = (
  currentUser: string,
  requestId: string,
): RequestHistoryItem | undefined => {
  const allHistory = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || '{}',
  );
  const userHistory = allHistory[currentUser] || [];

  return userHistory.find((item: RequestHistoryItem) => item.id === requestId);
};
