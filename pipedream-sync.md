# 🔄 Pipedream Synchronization Guide

## Strategy 1: GitHub as Single Source of Truth (Recommended)

### Setup Process

1. **Configure Pipedream to Import from GitHub:**
   ```javascript
   // In your Pipedream workflow steps, use GitHub imports
   import { extract } from 'https://raw.githubusercontent.com/lorenzlk/autoinjector/main/steps/extract.js'
   import { fetch } from 'https://raw.githubusercontent.com/lorenzlk/autoinjector/main/steps/fetch.js'
   import { generateSnippet } from 'https://raw.githubusercontent.com/lorenzlk/autoinjector/main/steps/generate_snippet.js'
   ```

2. **Workflow Development Process:**
   ```bash
   # 1. Make changes locally
   git checkout -b feature/improve-extraction
   
   # 2. Test locally first
   npm test
   npm run visual-test
   
   # 3. Commit and push
   git add .
   git commit -m "feat: improve extraction algorithm"
   git push origin feature/improve-extraction
   
   # 4. Merge to main after review
   git checkout main
   git merge feature/improve-extraction
   git push origin main
   
   # 5. Pipedream workflows automatically get updates!
   ```

### Auto-Sync Configuration

Create webhook to auto-update Pipedream workflows:

```javascript
// In Pipedream: Create a workflow triggered by GitHub webhook
export default defineComponent({
  name: "Auto-sync AutoInjector Components",
  version: "0.1.0",
  props: {
    github: {
      type: "app",
      app: "github",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run({ steps, $ }) {
    const { body } = steps.trigger.event;
    
    // Only sync on main branch pushes
    if (body.ref === 'refs/heads/main') {
      console.log('🔄 AutoInjector code updated - workflows will use new version automatically');
      
      // Optional: Send notification to Slack/Discord
      // Optional: Trigger test workflows
    }
    
    $.respond({
      status: 200,
      body: { message: "Sync acknowledged" }
    });
  },
});
```

## Strategy 2: Dual Development with Git Hooks

### Pre-commit Hook Setup

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Test local changes
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed - commit aborted"
  exit 1
fi

# Check Pipedream compatibility
npm run pipedream-check
if [ $? -ne 0 ]; then
  echo "❌ Pipedream compatibility check failed"
  exit 1
fi

echo "✅ Pre-commit checks passed"
```

### Pipedream Compatibility Checker

```javascript
// scripts/pipedream-check.js
import fs from 'fs';
import { extract } from './steps/extract.js';
import { fetch } from './steps/fetch.js';
import { generateSnippet } from './steps/generate_snippet.js';

console.log('🔍 Checking Pipedream compatibility...');

// Test that components export properly
const requiredExports = [
  { module: extract, name: 'extract' },
  { module: fetch, name: 'fetch' },
  { module: generateSnippet, name: 'generateSnippet' }
];

let allValid = true;

requiredExports.forEach(({ module, name }) => {
  if (typeof module?.run !== 'function') {
    console.error(`❌ ${name} missing run() function`);
    allValid = false;
  } else {
    console.log(`✅ ${name} component valid`);
  }
});

if (allValid) {
  console.log('✅ All Pipedream components valid');
  process.exit(0);
} else {
  console.error('❌ Pipedream compatibility issues found');
  process.exit(1);
}
```

## Strategy 3: CI/CD Pipeline Integration

### Enhanced GitHub Actions for Pipedream

```yaml
# .github/workflows/pipedream-sync.yml
name: Pipedream Sync

on:
  push:
    branches: [ main ]
    paths: [ 'steps/**' ]

jobs:
  pipedream-sync:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Test Pipedream compatibility
      run: npm run pipedream-check
    
    - name: Notify Pipedream workflows
      run: |
        curl -X POST "${{ secrets.PIPEDREAM_WEBHOOK_URL }}" \
          -H "Content-Type: application/json" \
          -d '{
            "event": "code_updated",
            "branch": "${{ github.ref_name }}",
            "commit": "${{ github.sha }}",
            "modified_files": ${{ toJson(github.event.commits[0].modified) }}
          }'
    
    - name: Update Pipedream components
      uses: pipedream/github-action@v1
      with:
        token: ${{ secrets.PIPEDREAM_API_KEY }}
        component_ids: 'dc_abc123,dc_def456,dc_ghi789'
        action: 'refresh'
```

## Best Practices for Dual Environment Development

### 1. Code Structure Standards

```javascript
// ✅ Good: Works in both environments
export default defineComponent({
  async run({ steps }) {
    // Universal logic that works locally and in Pipedream
    const html = steps.fetch?.html || process.env.TEST_HTML;
    return await extractCandidates(html);
  }
});

// ❌ Avoid: Environment-specific code
if (process.env.NODE_ENV === 'development') {
  // This won't work in Pipedream
}
```

### 2. Testing Strategy

```javascript
// test/pipedream-integration.test.js
import { extract } from '../steps/extract.js';

test('Pipedream component integration', async () => {
  const mockSteps = {
    fetch: { html: '<html>test content</html>' },
    trigger: { event: { query: { url: 'https://example.com' } } }
  };
  
  const result = await extract.run({ steps: mockSteps });
  
  expect(result.candidates).toBeDefined();
  expect(result.candidates.length).toBeGreaterThan(0);
});
```

### 3. Environment Detection

```javascript
// utils/environment.js
export const isPipedreamEnvironment = () => {
  return typeof process.env.PIPEDREAM_API_HOST !== 'undefined';
};

export const isLocalEnvironment = () => {
  return process.env.NODE_ENV === 'development';
};

// Usage in components
if (isPipedreamEnvironment()) {
  // Pipedream-specific logic
} else {
  // Local server logic
}
```

### 4. Shared Configuration

```javascript
// config/shared.js - Works in both environments
export const CONFIG = {
  MAX_CANDIDATES: 50,
  TIMEOUT_MS: 30000,
  DEFAULT_CONTEXT: 'after_ad',
  SUPPORTED_PROTOCOLS: ['http:', 'https:'],
  
  // Environment-specific overrides
  ...(isPipedreamEnvironment() && {
    MAX_CANDIDATES: 25, // Pipedream memory limits
    TIMEOUT_MS: 15000   // Pipedream execution limits
  })
};
```

## Deployment Workflow

### 1. Development Process

```bash
# 1. Create feature branch
git checkout -b feature/new-extraction-pattern

# 2. Develop with both environments in mind
npm run dev          # Test local server
npm run pipedream-test  # Test Pipedream compatibility

# 3. Run comprehensive tests
npm test
npm run lint
npm run pipedream-check

# 4. Commit with descriptive messages
git commit -m "feat: add LinkedIn article extraction support

- Adds LinkedIn-specific selectors
- Improves scoring for professional content
- Compatible with both local and Pipedream environments
- Tests pass in both environments"

# 5. Push and create PR
git push origin feature/new-extraction-pattern
```

### 2. Production Deployment

```bash
# After PR approval and merge to main:

# 1. Tag release
git tag -a v1.2.0 -m "Release v1.2.0: LinkedIn support"
git push origin v1.2.0

# 2. Pipedream workflows automatically update
# 3. Local deployments use latest main branch
# 4. Docker images rebuild with new tag
```

## Monitoring and Debugging

### 1. Shared Logging

```javascript
// utils/logger.js
export const log = (message, data = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    environment: isPipedreamEnvironment() ? 'pipedream' : 'local',
    message,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
};

// Usage
log('Extraction started', { 
  url: targetUrl, 
  candidatesFound: candidates.length 
});
```

### 2. Error Tracking

```javascript
// utils/errors.js
export const handleError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    environment: isPipedreamEnvironment() ? 'pipedream' : 'local',
    context,
    timestamp: new Date().toISOString()
  };
  
  // Log error
  console.error('🚨 Error:', JSON.stringify(errorInfo));
  
  // In Pipedream, errors are automatically captured
  // In local environment, could send to error tracking service
  if (!isPipedreamEnvironment() && process.env.SENTRY_DSN) {
    // Send to Sentry or similar
  }
  
  throw error; // Re-throw for proper handling
};
```

## Quick Reference Commands

```bash
# Development
npm run dev                    # Local server
npm run pipedream-test        # Test Pipedream compatibility
npm run sync-check           # Check if environments are in sync

# Testing
npm test                     # All tests
npm run test:pipedream      # Pipedream-specific tests
npm run test:integration    # Integration tests

# Deployment
git push origin main        # Triggers auto-sync to Pipedream
npm run deploy             # Deploy local/Docker version
npm run pipedream-deploy   # Manual Pipedream component updates
``` 