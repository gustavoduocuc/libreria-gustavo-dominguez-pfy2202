import { webcrypto } from 'crypto';
import { TextDecoder, TextEncoder } from 'util';
import '@testing-library/jest-dom';
import { bookStore } from './mocks/backend/bookStore';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.crypto === 'undefined') {
  global.crypto = webcrypto;
}

afterEach(() => {
  delete global.fetch;
  bookStore.reset();
});
