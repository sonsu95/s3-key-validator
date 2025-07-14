import type { ValidationOptions, ValidationResult } from '../types/index.js';
import { ValidationResultBuilder } from './result.js';
import { CharacterValidator, LengthValidator, EncodingValidator, PathValidator } from '../validators/index.js';
import { getPreset } from '../presets/index.js';

export class S3KeyValidator {
  static validate(key: string, options: ValidationOptions = {}): ValidationResult {
    const resolvedOptions = this.resolveOptions(options);
    const resultBuilder = new ValidationResultBuilder();

    const lengthErrors = LengthValidator.validate(key, resolvedOptions);
    resultBuilder.addErrors(lengthErrors);

    const encodingErrors = EncodingValidator.validate(key);
    resultBuilder.addErrors(encodingErrors);

    const pathErrors = PathValidator.validate(key, resolvedOptions);
    resultBuilder.addErrors(pathErrors);

    const characterResult = CharacterValidator.validate(key, resolvedOptions);
    resultBuilder.addErrors(characterResult.errors);
    resultBuilder.addWarnings(characterResult.warnings);

    this.addSuggestions(resultBuilder, key, resolvedOptions);

    return resultBuilder.build();
  }

  private static resolveOptions(options: ValidationOptions): ValidationOptions {
    if (options.mode) {
      const preset = getPreset(options.mode);
      return {
        ...preset,
        ...options,
        specialChars: {
          ...preset.specialChars,
          ...options.specialChars
        },
        languages: {
          ...preset.languages,
          ...options.languages
        }
      };
    }

    return {
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
      allowDotPrefix: false,
      ...options
    };
  }

  private static addSuggestions(
    resultBuilder: ValidationResultBuilder, 
    key: string, 
    options: ValidationOptions
  ): void {
    if (key.includes('//')) {
      resultBuilder.addSuggestion('Remove consecutive slashes (//)');
    }

    if (key.endsWith('/')) {
      resultBuilder.addSuggestion('Remove trailing slash');
    }

    if (key.startsWith('./')) {
      resultBuilder.addSuggestion('Remove "./" prefix for better console compatibility');
    }

    if (key.includes('../')) {
      resultBuilder.addSuggestion('Remove relative path elements ("../")');
    }

    if (/[\\{}^%`]">~<#|]/.test(key)) {
      resultBuilder.addSuggestion('Remove forbidden characters: \\ { } ^ % ` ] " > [ ~ < # |');
    }

    if (key.includes(' ') && !options.specialChars?.allowSpace) {
      resultBuilder.addSuggestion('Replace spaces with hyphens (-) or underscores (_)');
    }

    if (key.includes(':') && !options.specialChars?.allowColon) {
      resultBuilder.addSuggestion('Replace colons (:) with hyphens (-) or underscores (_)');
    }

    if (key.includes('@') && !options.specialChars?.allowAt) {
      resultBuilder.addSuggestion('Replace @ symbols with hyphens (-) or underscores (_)');
    }
  }
}