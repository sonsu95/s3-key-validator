import type { ValidationOptions } from '../types/index.js';

export const permissivePreset: ValidationOptions = {
  mode: 'permissive',
  specialChars: {
    allowSlash: true,
    allowColon: true,
    allowSpace: true,
    allowAt: true,
    allowAmpersand: true,
    allowDollar: true
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