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

// import * as firebase from 'firebase/app';
// import * as auth from 'firebase/auth';

// // Define the User and AuthResponse interfaces based on Firebase's expected structure
// interface User {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
// }

// interface AuthResponse {
//   user: User;
// }

// // Mocking the Firebase Auth module
// jest.mock('firebase/auth', () => {
//   return {
//     initializeApp: jest.fn(),
//     getAuth: jest.fn(() => ({
//       // Mock any auth methods you need
//       currentUser: null,
//     })),
//     createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
//       user: {
//         uid: 'test-uid',
//         displayName: 'Test User',
//         email: 'test@example.com',
//       },
//     } as unknown as AuthResponse), // Explicitly type the return value
//     updateProfile: jest.fn().mockResolvedValue({}),
//   };
// });

// // You can mock other Firebase services as needed
// jest.mock('firebase/firestore', () => ({
//   getFirestore: jest.fn(),
//   // Mock other Firestore methods if necessary
// }));
