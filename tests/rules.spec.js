import { between, equal, min, max } from '../src/rules/index';

import cases from 'jest-in-case';

describe('between', () => {
  cases(
    'between(value, [min, max])',
    (opts) => {
      expect(between(opts.value, [opts.min, opts.max])).toBe(opts.isValid);
    },
    [
      { isValid: true, value: 1, min: 1, max: 5 },
      { isValid: true, value: 5, min: 1, max: 5 },
      { isValid: true, value: 3, min: 1, max: 5 },
      { isValid: false, value: 8, min: 1, max: 5 },
      { isValid: false, value: 0, min: 1, max: 5 }
    ]
  );
});

cases(
  'equal(value, [comparative])',
  ({ value, comparative, isValid }) => {
    expect(equal(value, [comparative])).toBe(isValid);
  },
  [
    { isValid: true, value: 123, comparative: 123 },
    { isValid: true, value: 'abc', comparative: 'abc' },
    { isValid: false, value: 33, comparative: 11 }
  ]
);

cases(
  'min(value, [min])',
  ({ value, minVal, isValid }) => {
    expect(min(value, [minVal])).toBe(isValid);
  },
  [
    { isValid: true, value: 3, minVal: 1 },
    { isValid: true, value: 1, minVal: 1 },
    { isValid: false, value: 0, minVal: 1 }
  ]
);

cases(
  'max(value, [min])',
  ({ value, maxVal, isValid }) => {
    expect(max(value, [maxVal])).toBe(isValid);
  },
  [
    { isValid: true, value: 3, maxVal: 3 },
    { isValid: true, value: 1, maxVal: 3 },
    { isValid: false, value: 5, maxVal: 3 }
  ]
);
