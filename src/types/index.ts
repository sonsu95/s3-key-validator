export type ValidationMode = 'strict' | 'standard' | 'permissive';

export interface ValidationOptions {
  mode?: ValidationMode;
  
  specialChars?: {
    allowSlash?: boolean;
    allowColon?: boolean;
    allowSpace?: boolean;
    allowAt?: boolean;
    allowAmpersand?: boolean;
    allowDollar?: boolean;
  };
  
  languages?: {
    allowJapanese?: boolean;
    allowKorean?: boolean;
    allowChinese?: boolean;
    allowCJK?: boolean;
  };
  
  additionalChars?: string[];
  maxLength?: number;
  allowRelativePaths?: boolean;
  allowDotPrefix?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
  suggestions?: string[];
}

export interface ValidationError {
  type: 'LENGTH' | 'CHARACTER' | 'PATH' | 'ENCODING';
  message: string;
  position?: number;
  character?: string;
}

export interface ValidationWarning {
  type: 'COMPATIBILITY' | 'PERFORMANCE' | 'SECURITY' | 'ENCODING';
  message: string;
}