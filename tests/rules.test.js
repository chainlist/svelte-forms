import {
  between,
  email,
  equal,
  max,
  min,
  required,
  url
} from '../src/rules/index';

import cases from 'jest-in-case';

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

cases(
  'required(value)',
  ({ value, isValid }) => {
    expect(required(value)).toBe(isValid);
  },
  [
    { isValid: true, value: 123 },
    { isValid: true, value: 'abc' },
    { isValid: false, value: '' },
    { isValid: false, value: '   ' },
    { isValid: false, value: null },
    { isValid: false, value: undefined }
  ]
);

cases(
  'email(value)',
  ({ value, isValid }) => {
    expect(email(value)).toBe(isValid);
  },
  [
    { isValid: true, value: 'charlie@charleston.com' },
    { isValid: true, value: 'a.nonymous@example.com' },
    { isValid: true, value: 'name+tag@example.com' },
    { isValid: true, value: '"spaces may be quoted"@example.com' },
    { isValid: true, value: "!#$%&'*+-/=.?^_`{|}~@[1.0.0.127]" },
    { isValid: false, value: '' },
    { isValid: false, value: undefined },
    { isValid: false, value: null },
    { isValid: false, value: 'me@' },
    { isValid: false, value: '@example.com' },
    { isValid: false, value: 'me.@example.com' },
    { isValid: false, value: '.me@example.com' },
    { isValid: false, value: 'me@example..com' },
    {
      isValid: false,
      value: 'spaces must be within quotes even when escaped@example.com'
    },
    { isValid: false, value: 'a@mustbeinquotes@example.com' }
  ]
);

cases(
  'url(value)',
  ({ value, isValid }) => {
    expect(url(value)).toBe(isValid);
  },
  [
    { isValid: true, value: 'http://a.b-c.de' },
    { isValid: true, value: 'http://code.google.com/events/#&product=browser' },
    { isValid: true, value: 'https://userid@example.com/' },
    { isValid: true, value: 'http://domain.com:8080' },
    { isValid: false, value: 'just_text' },
    { isValid: false, value: 'http://' },
    { isValid: false, value: '//a' },
    { isValid: false, value: ':// should fail' },
    { isValid: false, value: '' },
    { isValid: false, value: undefined },
    { isValid: false, value: null }
  ]
);
