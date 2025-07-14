import type { ValidationOptions, ValidationError } from '../types/index.js';

export class EncodingValidator {
  static validate(key: string, options: ValidationOptions): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.isValidUTF8(key)) {
      errors.push({
        type: 'ENCODING',
        message: 'Key contains invalid UTF-8 sequences'
      });
    }

    const controlCharErrors = this.checkControlCharacters(key);
    errors.push(...controlCharErrors);

    return errors;
  }

  private static isValidUTF8(str: string): boolean {
    try {
      const encoded = new TextEncoder().encode(str);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      return decoded === str;
    } catch {
      return false;
    }
  }

  private static checkControlCharacters(key: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      const charCode = char.charCodeAt(0);
      
      if (this.isControlCharacter(charCode)) {
        errors.push({
          type: 'ENCODING',
          message: `Control character (U+${charCode.toString(16).toUpperCase().padStart(4, '0')}) at position ${i}`,
          position: i,
          character: char
        });
      }
    }
    
    return errors;
  }

  private static isControlCharacter(charCode: number): boolean {
    return (
      (charCode >= 0x00 && charCode <= 0x1F) ||
      (charCode >= 0x7F && charCode <= 0x9F)
    );
  }
}