import { describe, it, expect } from 'vitest';
import { validateS3Key } from '../src/index';

describe('validateS3Key', () => {
  it('should return true for valid key', () => {
    expect(validateS3Key('folder/file.txt')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateS3Key('')).toBe(false);
  });
});