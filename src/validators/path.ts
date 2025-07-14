import type { ValidationOptions, ValidationError } from '../types/index.js';

export class PathValidator {
  static validate(key: string, options: ValidationOptions): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!options.allowDotPrefix && key.startsWith('./')) {
      errors.push({
        type: 'PATH',
        message: 'Keys starting with "./" are not allowed (console limitation)',
        position: 0,
      });
    }

    if (!options.allowRelativePaths && key.includes('../')) {
      const position = key.indexOf('../');
      errors.push({
        type: 'PATH',
        message: 'Relative path elements "../" are not allowed',
        position,
      });
    }

    const consecutiveSlashErrors = this.checkConsecutiveSlashes(key);
    errors.push(...consecutiveSlashErrors);

    const trailingSlashErrors = this.checkTrailingSlashes(key);
    errors.push(...trailingSlashErrors);

    return errors;
  }

  private static checkConsecutiveSlashes(key: string): ValidationError[] {
    const errors: ValidationError[] = [];
    let position = key.indexOf('//');

    while (position !== -1) {
      errors.push({
        type: 'PATH',
        message: 'Consecutive slashes "//" are not recommended',
        position,
      });
      position = key.indexOf('//', position + 1);
    }

    return errors;
  }

  private static checkTrailingSlashes(key: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (key.endsWith('/')) {
      errors.push({
        type: 'PATH',
        message: 'Trailing slash is not recommended for object keys',
        position: key.length - 1,
      });
    }

    return errors;
  }
}
