import { between } from '../src/rules/index';

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
