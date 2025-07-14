# S3 Key Validator

AWS S3 object key validation library for TypeScript

## Installation

```bash
npm install s3-key-validator
# or
pnpm add s3-key-validator
# or
yarn add s3-key-validator
```

## Usage

```typescript
import { validateS3Key } from 's3-key-validator';

// Basic validation
const isValid = validateS3Key('folder/file.txt');
console.log(isValid); // true
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## License

MIT
