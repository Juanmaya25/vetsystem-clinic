import { describe, it, expect } from 'vitest';
import { fmt } from './format.js';

describe('fmt', () => {
  it('formats a number as Colombian pesos with thousands separators', () => {
    expect(fmt(11500000)).toBe('$11.500.000');
  });

  it('returns $0 for null, undefined or NaN', () => {
    expect(fmt(null)).toBe('$0');
    expect(fmt(undefined)).toBe('$0');
    expect(fmt(NaN)).toBe('$0');
  });

  it('formats medication prices', () => {
    expect(fmt(2800)).toBe('$2.800');
  });
});
