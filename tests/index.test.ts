import { describe, it, expect } from 'vitest';
import { validateS3Key, isValidS3Key, sanitizeS3Key } from '../src/index.js';

describe('validateS3Key', () => {
  describe('basic validation', () => {
    it('should validate valid key', () => {
      const result = validateS3Key('folder/file.txt');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty string', () => {
      const result = validateS3Key('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe('LENGTH');
    });

    it('should reject forbidden characters', () => {
      const result = validateS3Key('file<name>.txt');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].type).toBe('CHARACTER');
      expect(result.errors[1].type).toBe('CHARACTER');
    });
  });

  describe('preset modes', () => {
    it('should work with strict mode', () => {
      const result = validateS3Key('folder/file.txt', { mode: 'strict' });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].character).toBe('/');
    });

    it('should work with standard mode', () => {
      const result = validateS3Key('folder/file.txt', { mode: 'standard' });
      expect(result.isValid).toBe(true);
    });

    it('should work with permissive mode', () => {
      const result = validateS3Key('user@domain:file name.txt', { mode: 'permissive' });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
    });
  });

  describe('special characters', () => {
    it('should allow slash when configured', () => {
      const result = validateS3Key('folder/file.txt', {
        specialChars: { allowSlash: true }
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject slash when not configured', () => {
      const result = validateS3Key('folder/file.txt', {
        specialChars: { allowSlash: false }
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('language support', () => {
    it('should allow Japanese when configured', () => {
      const result = validateS3Key('ファイル名.txt', {
        languages: { allowJapanese: true }
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
    });

    it('should allow Korean when configured', () => {
      const result = validateS3Key('한국어파일명.txt', {
        languages: { allowKorean: true }
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toBeDefined();
    });

    it('should allow CJK when configured', () => {
      const result = validateS3Key('写真/桜の花.jpg', {
        languages: { allowCJK: true },
        specialChars: { allowSlash: true }
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('path validation', () => {
    it('should reject dot prefix by default', () => {
      const result = validateS3Key('./file.txt');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('PATH');
    });

    it('should reject relative paths by default', () => {
      const result = validateS3Key('../file.txt');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('PATH');
    });
  });

  describe('length validation', () => {
    it('should reject keys exceeding max length', () => {
      const longKey = 'a'.repeat(1025);
      const result = validateS3Key(longKey);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('LENGTH');
    });

    it('should respect custom max length', () => {
      const result = validateS3Key('a'.repeat(101), { maxLength: 100 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('LENGTH');
    });
  });
});

describe('isValidS3Key', () => {
  it('should return true for valid key', () => {
    expect(isValidS3Key('folder/file.txt')).toBe(true);
  });

  it('should return false for invalid key', () => {
    expect(isValidS3Key('file<name>.txt')).toBe(false);
  });
});

describe('sanitizeS3Key', () => {
  it('should remove forbidden characters', () => {
    const result = sanitizeS3Key('file<name>.txt');
    expect(result).toBe('filename.txt');
  });

  it('should remove consecutive slashes', () => {
    const result = sanitizeS3Key('folder//file.txt');
    expect(result).toBe('folder/file.txt');
  });

  it('should remove trailing slash', () => {
    const result = sanitizeS3Key('folder/');
    expect(result).toBe('folder');
  });

  it('should remove dot prefix', () => {
    const result = sanitizeS3Key('./file.txt');
    expect(result).toBe('file.txt');
  });

  it('should remove relative paths', () => {
    const result = sanitizeS3Key('../file.txt');
    expect(result).toBe('file.txt');
  });

  it('should replace spaces with hyphens by default', () => {
    const result = sanitizeS3Key('file name.txt');
    expect(result).toBe('file-name.txt');
  });

  it('should preserve spaces when allowed', () => {
    const result = sanitizeS3Key('file name.txt', {
      specialChars: { allowSpace: true }
    });
    expect(result).toBe('file name.txt');
  });
});