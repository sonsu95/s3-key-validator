import type { ValidationOptions, ValidationResult } from './types/index.js';
import { S3KeyValidator } from './core/index.js';

export function validateS3Key(key: string, options?: ValidationOptions): ValidationResult {
  return S3KeyValidator.validate(key, options);
}

export function isValidS3Key(key: string, options?: ValidationOptions): boolean {
  const result = S3KeyValidator.validate(key, options);
  return result.isValid;
}

export function sanitizeS3Key(key: string, options?: ValidationOptions): string {
  let sanitized = key;

  sanitized = sanitized.replace(/[\\{}^%`\]">~<#|]/g, '');

  sanitized = sanitized.replace(/\/+/g, '/');

  sanitized = sanitized.replace(/\/$/, '');

  if (sanitized.startsWith('./')) {
    sanitized = sanitized.substring(2);
  }

  sanitized = sanitized.replace(/\.\.\//g, '');

  if (!options?.specialChars?.allowSpace) {
    sanitized = sanitized.replace(/\s+/g, '-');
  }

  if (!options?.specialChars?.allowColon) {
    sanitized = sanitized.replace(/:/g, '-');
  }

  if (!options?.specialChars?.allowAt) {
    sanitized = sanitized.replace(/@/g, '-');
  }

  return sanitized;
}

export type {
  ValidationOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationMode,
} from './types/index.js';
export { strictPreset, standardPreset, permissivePreset } from './presets/index.js';
