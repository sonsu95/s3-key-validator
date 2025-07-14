import type { ValidationOptions } from '../types/index.js';

export const strictPreset: ValidationOptions = {
  mode: 'strict',
  specialChars: {
    allowSlash: false,
    allowColon: false,
    allowSpace: false,
    allowAt: false,
    allowAmpersand: false,
    allowDollar: false,
  },
  languages: {
    allowJapanese: false,
    allowKorean: false,
    allowChinese: false,
    allowCJK: false,
  },
  additionalChars: [],
  maxLength: 1024,
  allowRelativePaths: false,
  allowDotPrefix: false,
};
