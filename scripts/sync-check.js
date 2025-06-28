#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔄 Checking synchronization status between local and Pipedream...');

// Get current git info
let gitInfo;
try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const shortCommit = commit.substring(0, 7);
  const hasUncommitted = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
  
  gitInfo = {
    branch,
    commit,
    shortCommit,
    hasUncommitted
  };
} catch (error) {
  console.error('❌ Failed to get git information:', error.message);
  process.exit(1);
}

console.log(`📍 Current branch: ${gitInfo.branch}`);
console.log(`📍 Current commit: ${gitInfo.shortCommit}`);

if (gitInfo.hasUncommitted) {
  console.warn('⚠️  Warning: You have uncommitted changes');
  console.log('💡 Pipedream will use the last committed version');
}

// Check if main branch is up to date
if (gitInfo.branch !== 'main') {
  console.warn(`⚠️  Warning: Currently on branch '${gitInfo.branch}', not main`);
  console.log('💡 Pipedream typically pulls from main branch');
  
  try {
    const mainCommit = execSync('git rev-parse origin/main', { encoding: 'utf8' }).trim().substring(0, 7);
    console.log(`📍 Main branch commit: ${mainCommit}`);
    
    if (mainCommit !== gitInfo.shortCommit) {
      console.warn('⚠️  Current branch differs from main');
    }
  } catch (error) {
    console.warn('⚠️  Could not check main branch status');
  }
}

// Generate current GitHub URLs
const repoUrl = 'https://raw.githubusercontent.com/lorenzlk/autoinjector/main';
const componentUrls = {
  fetch: `${repoUrl}/steps/fetch.js`,
  extract: `${repoUrl}/steps/extract.js`,
  generate: `${repoUrl}/steps/generate_snippet.js`
};

console.log('\n📋 Current GitHub component URLs for Pipedream:');
Object.entries(componentUrls).forEach(([name, url]) => {
  console.log(`  ${name.padEnd(8)}: ${url}`);
});

// Check file timestamps
console.log('\n📅 Component file status:');
const componentFiles = [
  'steps/fetch.js',
  'steps/extract.js', 
  'steps/generate_snippet.js'
];

componentFiles.forEach(file => {
  try {
    const stats = fs.statSync(file);
    const lastModified = stats.mtime.toISOString().split('T')[0];
    const size = (stats.size / 1024).toFixed(1);
    console.log(`  ${path.basename(file).padEnd(20)}: ${lastModified} (${size}KB)`);
  } catch (error) {
    console.error(`  ${path.basename(file).padEnd(20)}: ❌ File not found`);
  }
});

// Check if we can run compatibility tests
console.log('\n🧪 Running quick compatibility check...');
try {
  execSync('npm run pipedream-check', { stdio: 'pipe' });
  console.log('✅ Pipedream compatibility check passed');
} catch (error) {
  console.error('❌ Pipedream compatibility check failed');
  console.log('🔧 Run `npm run pipedream-check` for details');
}

// Recommendations
console.log('\n💡 Synchronization Recommendations:');

if (gitInfo.hasUncommitted) {
  console.log('1. 🔄 Commit your changes and push to update Pipedream');
  console.log('   git add . && git commit -m "update: component improvements"');
  console.log('   git push origin main');
}

if (gitInfo.branch !== 'main') {
  console.log('2. 🔀 Merge your changes to main branch');
  console.log('   git checkout main && git merge ' + gitInfo.branch);
  console.log('   git push origin main');
}

console.log('3. 🔗 Update your Pipedream workflow components to use these URLs:');
Object.entries(componentUrls).forEach(([name, url]) => {
  console.log(`   ${name}: ${url}`);
});

console.log('4. 🧪 Test your Pipedream workflow after updating');

// Summary
console.log('\n📊 Sync Status Summary:');
const isInSync = !gitInfo.hasUncommitted && gitInfo.branch === 'main';

if (isInSync) {
  console.log('✅ Local code is in sync with what Pipedream can access');
  console.log('🚀 Ready for production use');
} else {
  console.log('⚠️  Local code is NOT in sync with Pipedream');
  console.log('🔧 Follow the recommendations above to sync');
}

process.exit(isInSync ? 0 : 1); 