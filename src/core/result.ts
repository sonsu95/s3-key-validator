import type { ValidationResult, ValidationError, ValidationWarning } from '../types/index.js';

export class ValidationResultBuilder {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];
  private suggestions: string[] = [];

  addError(error: ValidationError): this {
    this.errors.push(error);
    return this;
  }

  addErrors(errors: ValidationError[]): this {
    this.errors.push(...errors);
    return this;
  }

  addWarning(warning: ValidationWarning): this {
    this.warnings.push(warning);
    return this;
  }

  addWarnings(warnings: ValidationWarning[]): this {
    this.warnings.push(...warnings);
    return this;
  }

  addSuggestion(suggestion: string): this {
    this.suggestions.push(suggestion);
    return this;
  }

  addSuggestions(suggestions: string[]): this {
    this.suggestions.push(...suggestions);
    return this;
  }

  build(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings.length > 0 ? this.warnings : undefined,
      suggestions: this.suggestions.length > 0 ? this.suggestions : undefined,
    };
  }

  static createValid(): ValidationResult {
    return {
      isValid: true,
      errors: [],
    };
  }

  static createInvalid(errors: ValidationError[]): ValidationResult {
    return {
      isValid: false,
      errors,
    };
  }
}
