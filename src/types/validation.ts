export interface CharacterSets {
  safeChars: string;
  specialChars: {
    slash: string;
    colon: string;
    space: string;
    at: string;
    ampersand: string;
    dollar: string;
  };
  forbiddenChars: string;
  unicodeRanges: {
    hiragana: [number, number];
    katakana: [number, number];
    cjkUnified: [number, number];
    hangul: [number, number];
  };
}

export interface ValidationContext {
  key: string;
  options: Required<ValidationOptions>;
  position: number;
}

export interface ValidationRule {
  name: string;
  validate: (context: ValidationContext) => ValidationError | null;
}

export interface PresetConfiguration {
  allowedChars: string;
  maxLength: number;
  allowRelativePaths: boolean;
  allowDotPrefix: boolean;
}

import type { ValidationOptions, ValidationError } from './index.js';