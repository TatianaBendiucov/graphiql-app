const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: () => ({}) })),
      set: jest.fn(() => Promise.resolve()),
    })),
  })),
};

const mockAuth = {
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
};

export const db = mockFirestore;
export const auth = mockAuth;

export const createUserWithEmailAndPassword = jest.fn(() =>
  Promise.resolve({ user: { uid: '12345', email: 'test@example.com' } }),
);

export const updateProfile = jest.fn(() => Promise.resolve());
