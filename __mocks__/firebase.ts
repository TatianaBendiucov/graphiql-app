// export const auth = {};

// export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
//     user: {
//         displayName: 'Test User',
//     },
// });

// export const updateProfile = jest.fn().mockResolvedValue({});

// export const db = {};

// export const initializeApp = jest.fn();
// export const getAuth = jest.fn(() => auth);
// export const getFirestore = jest.fn(() => db);
console.log('Mocked Firebase is loaded');

// const auth = {
//     onAuthStateChanged: jest.fn((callback) => {
//       // Call the callback with a mock user object to simulate a logged-in user
//       callback({ uid: "123", displayName: "Test User" });
//     }),
//     signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
//     signOut: jest.fn(() => Promise.resolve()),
//     currentUser: { uid: "123", displayName: "Test User" },
//   };

//   const db = {}; // Mock Firestore as needed

//   const initializeApp = jest.fn(() => ({}));
//   const getAuth = jest.fn(() => auth);
//   const getFirestore = jest.fn(() => db);

//   // Export the mocked functions
//   export { initializeApp, getAuth, getFirestore };

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
