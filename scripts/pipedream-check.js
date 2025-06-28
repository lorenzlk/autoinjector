#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Mock defineComponent function for local testing
global.defineComponent = (component) => component;

console.log('🔍 Checking Pipedream compatibility...');

// Import components after mocking defineComponent
let extract, fetch, generateSnippet;

try {
  extract = (await import('../steps/extract.js')).default;
  fetch = (await import('../steps/fetch.js')).default;
  generateSnippet = (await import('../steps/generate_snippet.js')).default;
} catch (error) {
  console.error('❌ Failed to import components:', error.message);
  process.exit(1);
}

// Test that components export properly
const requiredExports = [
  { module: extract, name: 'extract', file: 'steps/extract.js' },
  { module: fetch, name: 'fetch', file: 'steps/fetch.js' },
  { module: generateSnippet, name: 'generateSnippet', file: 'steps/generate_snippet.js' }
];

let allValid = true;
const issues = [];

// Check each component
requiredExports.forEach(({ module, name, file }) => {
  console.log(`\n📋 Checking ${name} component (${file}):`);
  
  // Check if module exports properly
  if (!module) {
    console.error(`  ❌ Module ${name} failed to import`);
    issues.push(`${name}: Failed to import`);
    allValid = false;
    return;
  }
  
  // Check for run function
  if (typeof module.run !== 'function') {
    console.error(`  ❌ ${name} missing run() function`);
    issues.push(`${name}: Missing run() function`);
    allValid = false;
  } else {
    console.log(`  ✅ run() function found`);
  }
  
  // Check for proper defineComponent structure
  if (!module.name && !module.version) {
    console.warn(`  ⚠️  ${name} missing name/version metadata (recommended for Pipedream)`);
  } else {
    console.log(`  ✅ Component metadata found`);
  }
  
  // Check file exists and is readable
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ File ${file} not found`);
    issues.push(`${name}: File not found`);
    allValid = false;
  } else {
    console.log(`  ✅ File exists and readable`);
  }
  
  // Check file content for Pipedream patterns
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('defineComponent')) {
      console.warn(`  ⚠️  ${name} doesn't use defineComponent export (may not work in Pipedream)`);
    } else {
      console.log(`  ✅ Uses defineComponent export`);
    }
    
    if (!content.includes('export default')) {
      console.error(`  ❌ ${name} missing default export`);
      issues.push(`${name}: Missing default export`);
      allValid = false;
    } else {
      console.log(`  ✅ Has default export`);
    }
    
  } catch (error) {
    console.error(`  ❌ Failed to read ${file}: ${error.message}`);
    issues.push(`${name}: Failed to read file`);
    allValid = false;
  }
});

// Test a mock workflow run
console.log('\n🧪 Testing mock workflow execution...');

const mockSteps = {
  fetch: { 
    html: '<html><body><div class="content">Test content</div><div class="comments">Comments section</div></body></html>' 
  },
  trigger: { 
    event: { 
      query: { 
        url: 'https://example.com/test-article',
        context: 'after_ad'
      } 
    } 
  }
};

try {
  // Test extract component
  console.log('  Testing extract component...');
  const extractResult = await extract.run({ steps: mockSteps });
  
  if (!extractResult || !extractResult.candidates) {
    console.error('  ❌ Extract component failed to return candidates');
    issues.push('extract: Failed mock execution');
    allValid = false;
  } else {
    console.log(`  ✅ Extract component returned ${extractResult.candidates.length} candidates`);
  }
  
  // Test generate snippet component
  console.log('  Testing generateSnippet component...');
  const snippetSteps = {
    ...mockSteps,
    extract: extractResult
  };
  
  const snippetResult = await generateSnippet.run({ steps: snippetSteps });
  
  if (!snippetResult || !snippetResult.snippet) {
    console.error('  ❌ GenerateSnippet component failed to return snippet');
    issues.push('generateSnippet: Failed mock execution');
    allValid = false;
  } else {
    console.log('  ✅ GenerateSnippet component returned valid snippet');
  }
  
} catch (error) {
  console.error(`  ❌ Mock workflow execution failed: ${error.message}`);
  issues.push(`Workflow execution: ${error.message}`);
  allValid = false;
}

// Summary
console.log('\n📊 Compatibility Check Summary:');

if (allValid) {
  console.log('✅ All Pipedream components are valid and compatible!');
  console.log('🚀 Components are ready for Pipedream deployment');
  
  console.log('\n💡 Next steps:');
  console.log('1. Push changes to GitHub main branch');
  console.log('2. Update Pipedream workflows to use latest GitHub URLs');
  console.log('3. Test workflows in Pipedream environment');
  
  process.exit(0);
} else {
  console.error('\n❌ Pipedream compatibility issues found:');
  issues.forEach(issue => console.error(`  • ${issue}`));
  
  console.log('\n🔧 Fix the above issues before deploying to Pipedream');
  console.log('📖 See pipedream-sync.md for detailed guidance');
  
  process.exit(1);
} 