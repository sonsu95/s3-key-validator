export { strictPreset } from './strict.js';
export { standardPreset } from './standard.js';
export { permissivePreset } from './permissive.js';

import type { ValidationOptions, ValidationMode } from '../types/index.js';
import { strictPreset } from './strict.js';
import { standardPreset } from './standard.js';
import { permissivePreset } from './permissive.js';

export function getPreset(mode: ValidationMode): ValidationOptions {
  switch (mode) {
    case 'strict':
      return strictPreset;
    case 'standard':
      return standardPreset;
    case 'permissive':
      return permissivePreset;
    default:
      return standardPreset;
  }
}