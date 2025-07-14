import type { ValidationOptions, ValidationError } from '../types/index.js';

export class LengthValidator {
  private static readonly DEFAULT_MAX_LENGTH = 1024;

  static validate(key: string, options: ValidationOptions): ValidationError[] {
    const errors: ValidationError[] = [];
    const maxLength = options.maxLength || this.DEFAULT_MAX_LENGTH;

    if (key.length === 0) {
      errors.push({
        type: 'LENGTH',
        message: 'Key cannot be empty'
      });
      return errors;
    }

    const byteLength = this.getByteLength(key);
    if (byteLength > maxLength) {
      errors.push({
        type: 'LENGTH',
        message: `Key exceeds maximum length of ${maxLength} bytes (current: ${byteLength} bytes)`
      });
    }

    return errors;
  }

  private static getByteLength(str: string): number {
    return new TextEncoder().encode(str).length;
  }
}