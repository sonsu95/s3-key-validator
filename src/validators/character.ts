import type { ValidationOptions, ValidationError, ValidationWarning } from '../types/index.js';

export class CharacterValidator {
  private static readonly SAFE_CHARS = "0-9a-zA-Z!\\-_.*'()";
  private static readonly SPECIAL_CHARS = {
    slash: '/',
    colon: ':',
    space: ' ',
    at: '@',
    ampersand: '&',
    dollar: '$',
  };
  private static readonly FORBIDDEN_CHARS = '\\\\{}^%`]">~<#|';

  private static readonly UNICODE_RANGES = {
    hiragana: [0x3040, 0x309f],
    katakana: [0x30a0, 0x30ff],
    cjkUnified: [0x4e00, 0x9faf],
    hangul: [0xac00, 0xd7af],
  };

  static validate(
    key: string,
    options: ValidationOptions,
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      const result = this.validateCharacter(char, i, options);

      if (result.error) {
        errors.push(result.error);
      }
      if (result.warning) {
        warnings.push(result.warning);
      }
    }

    return { errors, warnings };
  }

  private static validateCharacter(
    char: string,
    position: number,
    options: ValidationOptions,
  ): { error?: ValidationError; warning?: ValidationWarning } {
    const charCode = char.charCodeAt(0);

    if (this.isSafeCharacter(char)) {
      return {};
    }

    if (this.isForbiddenCharacter(char)) {
      return {
        error: {
          type: 'CHARACTER',
          message: `Forbidden character '${char}' at position ${position}`,
          position,
          character: char,
        },
      };
    }

    if (this.isSpecialCharacter(char)) {
      const allowed = this.isSpecialCharacterAllowed(char, options);
      if (!allowed) {
        return {
          error: {
            type: 'CHARACTER',
            message: `Special character '${char}' not allowed at position ${position}`,
            position,
            character: char,
          },
        };
      }

      return {
        warning: {
          type: 'COMPATIBILITY',
          message: `Special character '${char}' may cause compatibility issues`,
        },
      };
    }

    if (this.isLanguageCharacter(charCode)) {
      const allowed = this.isLanguageCharacterAllowed(charCode, options);
      if (!allowed) {
        return {
          error: {
            type: 'CHARACTER',
            message: `Multi-byte character '${char}' not allowed at position ${position}`,
            position,
            character: char,
          },
        };
      }

      return {
        warning: {
          type: 'ENCODING',
          message: 'Non-ASCII characters may cause compatibility issues',
        },
      };
    }

    if (options.additionalChars?.includes(char)) {
      return {};
    }

    return {
      error: {
        type: 'CHARACTER',
        message: `Invalid character '${char}' at position ${position}`,
        position,
        character: char,
      },
    };
  }

  private static isSafeCharacter(char: string): boolean {
    return /^[0-9a-zA-Z!\-_.*'()]$/.test(char);
  }

  private static isForbiddenCharacter(char: string): boolean {
    return /^[\\{}^%`\]">~<#|]$/.test(char);
  }

  private static isSpecialCharacter(char: string): boolean {
    return Object.values(this.SPECIAL_CHARS).includes(char);
  }

  private static isSpecialCharacterAllowed(char: string, options: ValidationOptions): boolean {
    const specialChars = options.specialChars || {};

    switch (char) {
      case this.SPECIAL_CHARS.slash:
        return specialChars.allowSlash || false;
      case this.SPECIAL_CHARS.colon:
        return specialChars.allowColon || false;
      case this.SPECIAL_CHARS.space:
        return specialChars.allowSpace || false;
      case this.SPECIAL_CHARS.at:
        return specialChars.allowAt || false;
      case this.SPECIAL_CHARS.ampersand:
        return specialChars.allowAmpersand || false;
      case this.SPECIAL_CHARS.dollar:
        return specialChars.allowDollar || false;
      default:
        return false;
    }
  }

  private static isLanguageCharacter(charCode: number): boolean {
    const ranges = this.UNICODE_RANGES;
    return (
      (charCode >= ranges.hiragana[0] && charCode <= ranges.hiragana[1]) ||
      (charCode >= ranges.katakana[0] && charCode <= ranges.katakana[1]) ||
      (charCode >= ranges.cjkUnified[0] && charCode <= ranges.cjkUnified[1]) ||
      (charCode >= ranges.hangul[0] && charCode <= ranges.hangul[1])
    );
  }

  private static isLanguageCharacterAllowed(charCode: number, options: ValidationOptions): boolean {
    const languages = options.languages || {};
    const ranges = this.UNICODE_RANGES;

    if (languages.allowCJK) {
      return true;
    }

    if (languages.allowJapanese) {
      if (
        (charCode >= ranges.hiragana[0] && charCode <= ranges.hiragana[1]) ||
        (charCode >= ranges.katakana[0] && charCode <= ranges.katakana[1]) ||
        (charCode >= ranges.cjkUnified[0] && charCode <= ranges.cjkUnified[1])
      ) {
        return true;
      }
    }

    if (languages.allowKorean) {
      if (charCode >= ranges.hangul[0] && charCode <= ranges.hangul[1]) {
        return true;
      }
    }

    if (languages.allowChinese) {
      if (charCode >= ranges.cjkUnified[0] && charCode <= ranges.cjkUnified[1]) {
        return true;
      }
    }

    return false;
  }
}
