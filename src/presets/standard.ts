import type { ValidationOptions } from '../types/index.js';

export const standardPreset: ValidationOptions = {
  mode: 'standard',
  specialChars: {
    allowSlash: true,
    allowColon: false,
    allowSpace: false,
    allowAt: false,
    allowAmpersand: false,
    allowDollar: false
  },
  languages: {
    allowJapanese: false,
    allowKorean: false,
    allowChinese: false,
    allowCJK: false
  },
  additionalChars: [],
  maxLength: 1024,
  allowRelativePaths: false,
  allowDotPrefix: false
};