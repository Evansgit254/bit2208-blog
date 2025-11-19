# Linting Issues to Fix

## Overview
The project has 21 ESLint errors that should be fixed before presenting to clients. These are mostly minor issues related to unused variables and empty catch blocks.

## Issues by File

### 1. e2e/global.setup.ts
- **Line 24**: Unused variable 'e' in catch block
- **Fix**: Either use the error variable or replace with `_e` to indicate intentionally unused

### 2. e2e/post.spec.ts
- **Line 66**: Unused variable 'e' in catch block
- **Line 66**: Empty block statement
- **Fix**: Add error handling or comment explaining why it's empty

### 3. e2e/visual.spec.ts
- **Line 7**: Unused variable 'e' in catch block
- **Line 7**: Empty block statement
- **Line 11, 43, 76**: Use of `any` type
- **Fix**: Replace `any` with proper types or `unknown`

### 4. functions/src/index.ts
- **Line 11**: Unused import 'onRequest'
- **Line 12**: Unused import 'logger'
- **Fix**: Remove unused imports or uncomment the example function

### 5. src/dataconnect-generated/react/index.d.ts
- **Line 3**: Unused imports 'UseQueryResult' and 'UseMutationResult'
- **Note**: This is generated code, may need to update generator config

### 6. src/services/sqliteAdapter.ts
- **Line 44**: Unused variable 'e' in catch block
- **Lines 172, 207, 232, 282**: Empty block statements
- **Fix**: Add proper error handling or logging

### 7. src/services/syncService.ts
- **Line 22, 123, 130**: Unused variable 'e' in catch blocks
- **Line 134**: Empty block statement
- **Fix**: Add error handling or use `_e` for intentionally unused

## Quick Fixes

### Pattern 1: Unused Error Variables
```typescript
// Before
} catch (e) {
  // empty or not using e
}

// After (Option 1 - Use the error)
} catch (e) {
  console.error('Error description:', e);
}

// After (Option 2 - Mark as intentionally unused)
} catch (_e) {
  // Intentionally ignoring error
}
```

### Pattern 2: Empty Catch Blocks
```typescript
// Before
} catch (e) {}

// After
} catch (e) {
  // Silently fail - error is expected in this context
  console.debug('Expected error:', e);
}
```

### Pattern 3: Any Types
```typescript
// Before
const data: any = ...;

// After
const data: unknown = ...;
// or
interface DataType {
  // define structure
}
const data: DataType = ...;
```

### Pattern 4: Unused Imports
```typescript
// Before
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// After - Remove if not used, or use them
// Remove the imports entirely if not needed
```

## Automated Fix

Some issues can be auto-fixed:
```bash
# Auto-fix what ESLint can fix
npm run lint -- --fix

# Then manually fix remaining issues
```

## Priority

1. **High Priority** (Security/Functionality)
   - Empty catch blocks in service files
   - Proper error handling in sync operations

2. **Medium Priority** (Code Quality)
   - Replace `any` types with proper types
   - Remove unused imports

3. **Low Priority** (Cosmetic)
   - Unused error variables in test files
   - Generated code issues (may not need fixing)

## Testing After Fixes

After fixing linting issues:
```bash
# Verify no linting errors
npm run lint

# Run tests to ensure nothing broke
npm test

# Run E2E tests
npm run test:e2e

# Full CI check
npm run ci
```

## Notes

- The generated code in `src/dataconnect-generated/` may not need manual fixes
- Consider adding `// eslint-disable-next-line` comments for intentional exceptions
- Update ESLint config if certain rules are too strict for your use case

## Estimated Time to Fix

- **Quick pass**: 15-20 minutes (mark unused variables, add basic error handling)
- **Thorough pass**: 30-45 minutes (proper error handling, type definitions)
