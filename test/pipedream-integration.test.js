#!/usr/bin/env node

// Mock defineComponent function for local testing
global.defineComponent = (component) => component;

// Simple test runner for Pipedream integration
let extract, fetch, generateSnippet;

try {
  extract = (await import('../steps/extract.js')).default;
  fetch = (await import('../steps/fetch.js')).default;
  generateSnippet = (await import('../steps/generate_snippet.js')).default;
} catch (error) {
  console.error('❌ Failed to import components:', error.message);
  process.exit(1);
}

console.log('🧪 Running Pipedream Integration Tests...');

let passed = 0;
let failed = 0;

function test(name, testFn) {
  try {
    testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

async function asyncTest(name, testFn) {
  try {
    await testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

// Test component exports
test('extract component has run function', () => {
  if (typeof extract.run !== 'function') {
    throw new Error('extract.run is not a function');
  }
});

test('fetch component has run function', () => {
  if (typeof fetch.run !== 'function') {
    throw new Error('fetch.run is not a function');
  }
});

test('generateSnippet component has run function', () => {
  if (typeof generateSnippet.run !== 'function') {
    throw new Error('generateSnippet.run is not a function');
  }
});

// Test component integration
await asyncTest('extract component with mock data', async () => {
  const mockSteps = {
    fetch: { 
      html: '<html><body><div class="content">Test content</div><div class="comments">Comments here</div></body></html>' 
    },
    trigger: { 
      event: { 
        query: { 
          url: 'https://example.com/test',
          context: 'after_ad'
        } 
      } 
    }
  };
  
  const result = await extract.run({ steps: mockSteps });
  
  if (!result) {
    throw new Error('extract returned null/undefined');
  }
  
  if (!result.candidates) {
    throw new Error('extract result missing candidates');
  }
  
  if (!Array.isArray(result.candidates)) {
    throw new Error('candidates is not an array');
  }
  
  if (result.candidates.length === 0) {
    throw new Error('no candidates found');
  }
});

await asyncTest('generateSnippet component integration', async () => {
  const mockSteps = {
    fetch: { 
      html: '<html><body><div class="content">Test content</div></body></html>' 
    },
    trigger: { 
      event: { 
        query: { 
          url: 'https://example.com/test',
          context: 'after_ad'
        } 
      } 
    },
    extract: {
      candidates: [
        {
          tagName: 'div',
          id: 'test-id',
          className: 'test-class',
          selector: '.test-class',
          injectionScore: 45
        }
      ]
    }
  };
  
  const result = await generateSnippet.run({ steps: mockSteps });
  
  if (!result) {
    throw new Error('generateSnippet returned null/undefined');
  }
  
  if (!result.snippet) {
    throw new Error('generateSnippet result missing snippet');
  }
  
  if (typeof result.snippet !== 'string') {
    throw new Error('snippet is not a string');
  }
  
  if (result.snippet.length === 0) {
    throw new Error('snippet is empty');
  }
});

// Test error handling
await asyncTest('extract component handles missing HTML', async () => {
  const mockSteps = {
    fetch: {},
    trigger: { 
      event: { 
        query: { 
          url: 'https://example.com/test'
        } 
      } 
    }
  };
  
  try {
    await extract.run({ steps: mockSteps });
    throw new Error('Expected extract to throw error for missing HTML');
  } catch (error) {
    if (error.message.includes('No HTML content received')) {
      // Expected error - test passes
    } else {
      throw error;
    }
  }
});

// Summary
console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('🎉 All Pipedream integration tests passed!');
  process.exit(0);
} else {
  console.error('💥 Some tests failed - check compatibility issues');
  process.exit(1);
} 